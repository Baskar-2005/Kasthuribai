import { CartItem } from "@/store/use-cart";

// Razorpay key ID (public key) - loaded from environment variable
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// API base URL - adjust based on your environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Load Razorpay script dynamically with retry logic
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If Razorpay is already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      // Script is already being loaded, wait for it
      const checkLoaded = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkLoaded);
          resolve(true);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        resolve(false);
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Wait a bit for Razorpay to initialize
      setTimeout(() => {
        if (window.Razorpay) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    };
    
    script.onerror = () => {
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (
  amount: number,
  items: CartItem[],
  customerDetails: CustomerDetails
): Promise<RazorpayOrder> => {
  try {
    const response = await fetch(`${API_BASE_URL}/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          itemCount: items.length.toString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to create order");
    }

    return data.order;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please ensure the API server is running.");
    }
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (
  paymentDetails: PaymentDetails
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/razorpay/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to verify payment");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please ensure the API server is running.");
    }
    throw error;
  }
};

// Initialize Razorpay payment
export const initializePayment = async (
  order: RazorpayOrder,
  customerDetails: CustomerDetails,
  onSuccess: (paymentDetails: PaymentDetails) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Failed to load Razorpay script. Please check your internet connection and try again.");
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "KasthuriBai",
    description: "Order Payment",
    order_id: order.id,
    prefill: {
      name: customerDetails.name,
      email: customerDetails.email,
      contact: customerDetails.phone,
    },
    notes: {
      address: customerDetails.address,
    },
    theme: {
      color: "#8B4513",
    },
    handler: function (response: any) {
      onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: function () {
        onFailure(new Error("Payment cancelled by user"));
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on("payment.failed", function (response: any) {
    onFailure(response.error);
  });

  razorpay.open();
};
