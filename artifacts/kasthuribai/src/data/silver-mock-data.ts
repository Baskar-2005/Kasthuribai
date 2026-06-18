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
  purity: string; // e.g. "92.5 Hallmark Silver"
  weight: string; // e.g. "25g"
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

  // Flags for UI sections
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFestivalOffer?: boolean;
  searchTags: string[];
};

export const SILVER_CATEGORIES: { key: SilverCategoryKey; title: string; emoji: string; subtitle: string }[] = [
  { key: "anklets", title: "Silver Anklets (Kolusu)", emoji: "🦶", subtitle: "Traditional kolusu designs" },
  { key: "toe_rings", title: "Silver Toe Rings (Metti)", emoji: "✨", subtitle: "Temple & daily wear metti" },
  { key: "chains", title: "Silver Chains", emoji: "⛓️", subtitle: "Everyday to party chains" },
  { key: "rings", title: "Silver Rings", emoji: "💍", subtitle: "Minimal to ornate ring styles" },
  { key: "bracelets", title: "Silver Bracelets", emoji: "📿", subtitle: "Peacock & temple motifs" },
  { key: "bangles", title: "Silver Bangles", emoji: "🏵️", subtitle: "Stack-friendly bangles" },
  { key: "earrings", title: "Silver Earrings", emoji: "🪷", subtitle: "Lightweight earrings collection" },
  { key: "pooja", title: "Silver Pooja Collection", emoji: "🕉️", subtitle: "Pooja-ready silver essentials" },
  { key: "gifts", title: "Silver Gift Collection", emoji: "🎁", subtitle: "Perfect gifting picks" },
  { key: "kids", title: "Kids Silver Collection", emoji: "🧒", subtitle: "Cute & safe silver pieces" },
];

function mkImg(path: string) {
  // Prefer local royalty-free/demo images from public folder.
  // If file is missing, browser will show broken image icons.
  return path;
}


function silverImg(category: SilverCategoryKey, seed: number, variant: number) {
  const folder = {
    anklets: "anklets",
    toe_rings: "metti",
    chains: "chains",
    rings: "rings",
    bracelets: "bracelets",
    bangles: "bangles",
    earrings: "earrings",
    pooja: "pooja",
    gifts: "gifts",
    kids: "kids",
  }[category];

  // Expected filenames (you can later replace with your real images):
  // /images/silver/<category>/<seed>_<variant>.jpg
  // If you haven't added those files yet, browser will show broken image icons.
  const fallback = "/images/silver/_fallback.jpg";
  return mkImg(`/images/silver/${folder}/${seed}_${variant}.jpg`) || fallback;
}



function mkReviews(seed: string, baseRating = 4.6) {
  const r = [
    { rating: Math.min(5, Math.max(3, baseRating + 0.1)), name: "Priya", text: "Premium look and finish. Very happy with the quality.", date: "March 2026" },
    { rating: Math.min(5, Math.max(3, baseRating - 0.2)), name: "Ramesh", text: "Worth the price. Packaging was nice and neat.", date: "February 2026" },
    { rating: Math.min(5, Math.max(3, baseRating + 0.2)), name: "Meena", text: "Beautiful design. Comfortable for daily wear.", date: "January 2026" },
  ];
  return r.map((x, idx) => ({ id: `${seed}_rev_${idx}`, ...x }));
}

function calcDiscountPct(originalPrice: number, price: number) {
  if (originalPrice <= 0) return 0;
  return Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100));
}

function makeProduct(args: {
  id: string;
  categoryKey: SilverCategoryKey;
  categoryTitle: string;
  name: string;
  purity: string;
  weight: string;
  price: number;
  originalPrice: number;
  stockStatus: SilverProduct["stockStatus"];
  description: string;
  tags: string[];
  imageSeed: string;
  flags?: Partial<Pick<SilverProduct, "isNewArrival" | "isBestSeller" | "isTrending" | "isFestivalOffer">>;
}): SilverProduct {
  const discountPct = calcDiscountPct(args.originalPrice, args.price);
  const reviews = mkReviews(args.imageSeed, 4.6);
  const rating = reviews.reduce((s, x) => s + x.rating, 0) / reviews.length;
  return {
    id: args.id,
    categoryKey: args.categoryKey,
    categoryTitle: args.categoryTitle,
    name: args.name,
    purity: args.purity,
    weight: args.weight,
    price: args.price,
    originalPrice: args.originalPrice,
    discountPct,
    stockStatus: args.stockStatus,
    description: args.description,
    images: [mkImg(args.imageSeed), mkImg(args.imageSeed + "_2"), mkImg(args.imageSeed + "_3")],
    careInstructions: [
      "Wipe with a soft cloth after use.",
      "Avoid contact with perfumes and harsh chemicals.",
      "Store in a dry pouch to reduce tarnish.",
    ],
    shippingInfo: "Ships in 2–3 business days. Securely packed for safe delivery.",
    returnPolicy: "Returns accepted within 7 days for eligible items in original condition.",
    reviews,
    rating: Math.round(rating * 10) / 10,
    reviewCount: 128,
    searchTags: args.tags,
    ...args.flags,
  };
}

const PURITIES = ["92.5 Hallmark Silver", "999 Pure Silver", "Sterling Silver 92.5", "92.5 Premium Hallmark"];
const WEIGHTS = ["8g", "10g", "12g", "15g", "18g", "20g", "22g", "25g", "28g", "30g", "35g", "40g"];

function pick<T>(arr: T[], idx: number) {
  return arr[idx % arr.length];
}

function genCategoryProducts(categoryKey: SilverCategoryKey, categoryTitle: string, startIndex: number, namePrefix: string, basePrice: number, priceStep: number) {
  const count = 12;
  const out: SilverProduct[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const purity = pick(PURITIES, idx);
    const weight = pick(WEIGHTS, idx);
    const originalPrice = basePrice + i * priceStep + 300;
    const price = basePrice + i * priceStep;

    const flags: Partial<Pick<SilverProduct, "isNewArrival" | "isBestSeller" | "isTrending" | "isFestivalOffer">> = {
      isNewArrival: i % 4 === 0,
      isBestSeller: i % 5 === 0,
      isTrending: i % 3 === 0,
      isFestivalOffer: i % 6 === 0,
    };

    const tagTokens = [
      namePrefix,
      categoryTitle,
      "silver",
      "hallmark",
      ...(namePrefix.includes("Kolusu") ? ["kolusu", "anklet"] : []),
      ...(namePrefix.includes("Metti") ? ["metti", "toe ring"] : []),
    ];

    const stockStatus: SilverProduct["stockStatus"] = i % 11 === 0 ? "Low Stock" : "In Stock";

    out.push(
      makeProduct({
        id: `${categoryKey}_${idx}`,
        categoryKey,
        categoryTitle,
        name: `${namePrefix} ${i + 1}`,
        purity,
        weight,
        price: Math.max(199, Math.round(price / 1) / 1),
        originalPrice: Math.max(299, Math.round(originalPrice / 1) / 1),
        stockStatus,
        description: `${categoryTitle} made with ${purity}. Designed with elegant detailing and a comfortable feel for everyday wear and special occasions.`,
        tags: Array.from(new Set([...tagTokens, "gift", "pooja"])),
        imageSeed: `${categoryKey}_${idx}`,
        flags,
      })
    );
  }

  return out;
}

// Build each category with 12 products (12*10 = 120 products)
const anklets = genCategoryProducts(
  "anklets",
  "Silver Anklets (Kolusu)",
  1,
  "Silver Peacock Anklet",
  2499,
  160
);

const toeRings = genCategoryProducts(
  "toe_rings",
  "Silver Toe Rings (Metti)",
  101,
  "Traditional Metti Pair",
  799,
  45
);

const chains = genCategoryProducts(
  "chains",
  "Silver Chains",
  201,
  "Premium Silver Chain",
  1999,
  110
);

const rings = genCategoryProducts(
  "rings",
  "Silver Rings",
  301,
  "Temple Design Silver Ring",
  1299,
  70
);

const bracelets = genCategoryProducts(
  "bracelets",
  "Silver Bracelets",
  401,
  "Temple Design Silver Bracelet",
  2299,
  90
);

const bangles = genCategoryProducts(
  "bangles",
  "Silver Bangles",
  501,
  "Festival Silver Bangles",
  1799,
  85
);

const earrings = genCategoryProducts(
  "earrings",
  "Silver Earrings",
  601,
  "Stud Silver Earrings",
  999,
  50
);

const pooja = genCategoryProducts(
  "pooja",
  "Silver Pooja Collection",
  701,
  "Pooja Temple Silver Piece",
  1499,
  95
);

const gifts = genCategoryProducts(
  "gifts",
  "Silver Gift Collection",
  801,
  "Silver Gift Heart Motif",
  1099,
  80
);

const kids = genCategoryProducts(
  "kids",
  "Kids Silver Collection",
  901,
  "Kids Silver Anklet",
  999,
  35
);

export const SILVER_PRODUCTS: SilverProduct[] = [...anklets, ...toeRings, ...chains, ...rings, ...bracelets, ...bangles, ...earrings, ...pooja, ...gifts, ...kids];

