export type SilverCategoryKey =
  | "anklets"
  | "toe_rings"
  | "chains"
  | "rings"
  | "bracelets"
  | "bangles"
  | "earrings"
  | "pooja"
  | "gifts"
  | "kids";

export type SilverProduct = {
  id: string;
  categoryKey: SilverCategoryKey;
  categoryTitle: string;
  name: string;
  purity: string;
  weight: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  description: string;
  images: string[];
  careInstructions: string[];
  shippingInfo: string;
  returnPolicy: string;
  reviews: { id: string; name: string; rating: number; text: string; date: string }[];
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFestivalOffer?: boolean;
  searchTags: string[];
};

export const SILVER_CATEGORIES: {
  key: SilverCategoryKey;
  title: string;
  emoji: string;
  subtitle: string;
  folderName: string;
}[] = [
  { key: "anklets",   title: "Silver Anklets",        emoji: "🦶", subtitle: "Traditional kolusu designs",      folderName: "anklets"   },
  { key: "toe_rings", title: "Silver Toe Rings",       emoji: "✨", subtitle: "Temple & daily wear metti",       folderName: "metti"     },
  { key: "chains",    title: "Silver Chains",          emoji: "⛓️", subtitle: "Everyday to party chains",        folderName: "chains"    },
  { key: "rings",     title: "Silver Rings",           emoji: "💍", subtitle: "Minimal to ornate ring styles",   folderName: "rings"     },
  { key: "bracelets", title: "Silver Bracelets",       emoji: "📿", subtitle: "Peacock & temple motifs",         folderName: "bracelets" },
  { key: "bangles",   title: "Silver Bangles",         emoji: "🏵️", subtitle: "Stack-friendly bangles",          folderName: "bangles"   },
  { key: "earrings",  title: "Silver Earrings",        emoji: "🪷", subtitle: "Lightweight earrings collection", folderName: "earrings"  },
  { key: "pooja",     title: "Pooja Collection",       emoji: "🕉️", subtitle: "Pooja-ready silver essentials",   folderName: "pooja"     },
  { key: "gifts",     title: "Gift Collection",        emoji: "🎁", subtitle: "Perfect gifting picks",           folderName: "gifts"     },
  { key: "kids",      title: "Kids Silver",            emoji: "🧒", subtitle: "Cute & safe silver pieces",       folderName: "kids"      },
];

/** Returns one of the real image files for a category, cycling by index */
function categoryImg(folderName: string, variant: 1 | 2 | 3): string {
  return `/images/silver/${folderName}/${folderName}_1.png`;
}

function mkReviews(seed: string, baseRating = 4.6) {
  const r = [
    { rating: Math.min(5, Math.max(3, baseRating + 0.1)), name: "Priya",  text: "Premium look and finish. Very happy with the quality.", date: "March 2026"    },
    { rating: Math.min(5, Math.max(3, baseRating - 0.2)), name: "Ramesh", text: "Worth the price. Packaging was nice and neat.",         date: "February 2026" },
    { rating: Math.min(5, Math.max(3, baseRating + 0.2)), name: "Meena",  text: "Beautiful design. Comfortable for daily wear.",         date: "January 2026"  },
  ];
  return r.map((x, idx) => ({ id: `${seed}_rev_${idx}`, ...x }));
}

function calcDiscountPct(originalPrice: number, price: number) {
  if (originalPrice <= 0) return 0;
  return Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100));
}

const PURITIES = ["92.5 Hallmark Silver", "999 Pure Silver", "Sterling Silver 92.5", "92.5 Premium Hallmark"];
const WEIGHTS  = ["8g", "10g", "12g", "15g", "18g", "20g", "22g", "25g", "28g", "30g", "35g", "40g"];

function pick<T>(arr: T[], idx: number) { return arr[idx % arr.length]; }

function genCategoryProducts(
  categoryKey: SilverCategoryKey,
  categoryTitle: string,
  folderName: string,
  startIndex: number,
  namePrefix: string,
  basePrice: number,
  priceStep: number,
): SilverProduct[] {
  const count = 12;
  const out: SilverProduct[] = [];

  for (let i = 0; i < count; i++) {
    const idx         = startIndex + i;
    const purity      = pick(PURITIES, idx);
    const weight      = pick(WEIGHTS, idx);
    const originalPrice = basePrice + i * priceStep + 300;
    const price         = basePrice + i * priceStep;
    const discountPct   = calcDiscountPct(originalPrice, price);

    // Cycle through the 3 real images available for this category
    const imgVariant = ((i % 3) + 1) as 1 | 2 | 3;
    const mainImg    = categoryImg(folderName, imgVariant);
    const img2       = categoryImg(folderName, ((i + 1) % 3 + 1) as 1 | 2 | 3);
    const img3       = categoryImg(folderName, ((i + 2) % 3 + 1) as 1 | 2 | 3);

    const flags = {
      isNewArrival:    i % 4 === 0,
      isBestSeller:    i % 5 === 0,
      isTrending:      i % 3 === 0,
      isFestivalOffer: i % 6 === 0,
    };

    const stockStatus: SilverProduct["stockStatus"] = i % 11 === 0 ? "Low Stock" : "In Stock";

    const reviews = mkReviews(`${categoryKey}_${idx}`);
    const rating  = Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

    out.push({
      id:            `${categoryKey}_${idx}`,
      categoryKey,
      categoryTitle,
      name:          `${namePrefix} ${i + 1}`,
      purity,
      weight,
      price:         Math.max(199, price),
      originalPrice: Math.max(299, originalPrice),
      discountPct,
      stockStatus,
      description:   `${categoryTitle} crafted with ${purity}. Elegant detailing and a comfortable feel for everyday wear and special occasions.`,
      images:        [mainImg, img2, img3],
      careInstructions: [
        "Wipe with a soft cloth after use.",
        "Avoid contact with perfumes and harsh chemicals.",
        "Store in a dry pouch to reduce tarnish.",
      ],
      shippingInfo:  "Ships in 2–3 business days. Securely packed for safe delivery.",
      returnPolicy:  "Returns accepted within 7 days for eligible items in original condition.",
      reviews,
      rating,
      reviewCount:   128,
      searchTags:    [namePrefix, categoryTitle, "silver", "hallmark", "gift", "pooja"],
      ...flags,
    });
  }

  return out;
}

export const SILVER_PRODUCTS: SilverProduct[] = [
  ...genCategoryProducts("anklets",   "Silver Anklets",   "anklets",   1,   "Silver Peacock Anklet",        2499, 160),
  ...genCategoryProducts("toe_rings", "Silver Toe Rings", "metti",     101, "Traditional Metti Pair",       799,  45 ),
  ...genCategoryProducts("chains",    "Silver Chains",    "chains",    201, "Premium Silver Chain",         1999, 110),
  ...genCategoryProducts("rings",     "Silver Rings",     "rings",     301, "Temple Design Silver Ring",    1299, 70 ),
  ...genCategoryProducts("bracelets", "Silver Bracelets", "bracelets", 401, "Temple Design Bracelet",       2299, 90 ),
  ...genCategoryProducts("bangles",   "Silver Bangles",   "bangles",   501, "Festival Silver Bangles",      1799, 85 ),
  ...genCategoryProducts("earrings",  "Silver Earrings",  "earrings",  601, "Stud Silver Earrings",         999,  50 ),
  ...genCategoryProducts("pooja",     "Pooja Collection", "pooja",     701, "Pooja Temple Silver Piece",    1499, 95 ),
  ...genCategoryProducts("gifts",     "Gift Collection",  "gifts",     801, "Silver Gift Heart Motif",      1099, 80 ),
  ...genCategoryProducts("kids",      "Kids Silver",      "kids",      901, "Kids Silver Anklet",           999,  35 ),
];
