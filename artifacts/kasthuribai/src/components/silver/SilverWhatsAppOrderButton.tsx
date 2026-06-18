import { SilverProduct } from "@/data/silver-mock-data";

import type React from "react";

export function SilverWhatsAppOrderButton({ product }: { product: SilverProduct }): React.ReactElement {
  const productLink = `${window.location.origin}/silver-corner?product=${encodeURIComponent(product.id)}`;

  const handleClick = () => {
    const msg = encodeURIComponent(
      `Hi! I want to order *${product.name}*\n\n` +
        `Silver Purity: ${product.purity}\n` +
        `Weight: ${product.weight}\n` +
        `Price: ₹${product.price}\n\n` +
        `Link: ${productLink}\n\n` +
        `Please confirm availability and delivery.`
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white transition-colors font-body font-semibold text-sm"
    >
      WhatsApp Order
    </button>
  );
}

