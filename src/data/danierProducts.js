// Danier Product Database - Manually updated with actual website products
// Updated on: 2025-07-10T20:02:47.244Z
// Total products: 36
// Season codes: SP25 = Spring 2025, FA25 = Fall 2025

export const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed to 1-indexed
  
  // Spring: March (3) to August (8) - SP25
  // Fall: September (9) to February (2) - FA25
  if (month >= 3 && month <= 8) {
    return 'SP25';
  } else {
    return 'FA25';
  }
};

// Product categories for better organization
export const PRODUCT_CATEGORIES = {
  JACKETS: 'jackets',
  HANDBAGS: 'handbags',
  LAPTOP_BAGS: 'laptop_bags',
  TRAVEL: 'travel',
  ACCESSORIES: 'accessories',
  SHOES: 'shoes',
  WALLETS: 'wallets',
  GLOVES: 'gloves',
  MENS_MESSENGERS: 'mens_messengers',
  LUGGAGE: 'luggage',
  TRAVEL_WEAR: 'travel_wear',
  MENS_BAGS: 'mens_bags',
  WOMENS_BAGS: 'womens_bags'
};

// Comprehensive product data from Danier.com
export const DANIER_PRODUCTS = [
  {
    id: 1,
    name: "Monaco Reversible Jacket",
    category: PRODUCT_CATEGORIES.JACKETS,
    price: 449,
    originalPrice: 797,
    currency: "CAD",
    colors: ["BLACK"],
    season: "SP25",
    description: "Genuine leather reversible jacket with band collar",
    image: "monaco-reversible-jacket.jpg",
    onSale: true,
    url: "https://danier.com/products/monaco-reversible-jacket"
  },
  {
    id: 2,
    name: "Monaco Blazer",
    category: PRODUCT_CATEGORIES.JACKETS,
    price: 577,
    originalPrice: 577,
    currency: "CAD",
    colors: ["BLACK"],
    season: "SP25",
    description: "Leather blazer with 3-button front closure",
    image: "monaco-blazer.jpg",
    onSale: false,
    url: "https://danier.com/products/monaco-blazer"
  },
  {
    id: 3,
    name: "Monaco Bomber Jacket",
    category: PRODUCT_CATEGORIES.JACKETS,
    price: 497,
    originalPrice: 497,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Classic bomber jacket in premium leather",
    image: "monaco-bomber.jpg",
    onSale: false,
    url: "https://danier.com/products/monaco-bomber-jacket"
  },
  {
    id: 4,
    name: "Monaco Moto Jacket",
    category: PRODUCT_CATEGORIES.JACKETS,
    price: 597,
    originalPrice: 597,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Classic moto jacket with asymmetric zipper",
    image: "monaco-moto.jpg",
    onSale: false,
    url: "https://danier.com/products/monaco-moto-jacket"
  },
  {
    id: 5,
    name: "Colette Medium Bucket",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 229,
    originalPrice: 247,
    currency: "CAD",
    colors: ["BLACK","BROWN","TAN"],
    season: "SP25",
    description: "Medium bucket bag in premium leather",
    image: "colette-medium-bucket.jpg",
    onSale: true,
    url: "https://danier.com/products/colette-medium-bucket"
  },
  {
    id: 6,
    name: "Rhea Large Satchel",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 249,
    originalPrice: 277,
    currency: "CAD",
    colors: ["BLACK","BROWN","NAVY"],
    season: "SP25",
    description: "Large satchel bag with structured design",
    image: "rhea-large-satchel.jpg",
    onSale: true,
    url: "https://danier.com/products/rhea-large-satchel"
  },
  {
    id: 7,
    name: "Arleth Crossbody",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 239,
    originalPrice: 267,
    currency: "CAD",
    colors: ["BLACK","BROWN","WHITE"],
    season: "SP25",
    description: "Compact crossbody bag with adjustable strap",
    image: "arleth-crossbody.jpg",
    onSale: true,
    url: "https://danier.com/products/arleth-crossbody"
  },
  {
    id: 8,
    name: "Jovie Shoulder Bag",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 249,
    originalPrice: 297,
    currency: "CAD",
    colors: ["BLACK","BROWN","BURGUNDY"],
    season: "SP25",
    description: "Elegant shoulder bag with gold hardware",
    image: "jovie-shoulder-bag.jpg",
    onSale: true,
    url: "https://danier.com/products/jovie-shoulder-bag"
  },
  {
    id: 9,
    name: "Mariam Small Satchel",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 199,
    originalPrice: 199,
    currency: "CAD",
    colors: ["BLACK","SADDLE","WHITE"],
    season: "SP25",
    description: "Small satchel in premium leather",
    image: "mariam-small-satchel.jpg",
    onSale: false,
    url: "https://danier.com/products/mariam-small-satchel"
  },
  {
    id: 10,
    name: "Mariam Large Satchel",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 229,
    originalPrice: 229,
    currency: "CAD",
    colors: ["BLACK","SADDLE","WHITE"],
    season: "SP25",
    description: "Large satchel in premium leather",
    image: "mariam-large-satchel.jpg",
    onSale: false,
    url: "https://danier.com/products/mariam-large-satchel"
  },
  {
    id: 11,
    name: "Edith Crossbody",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 199,
    originalPrice: 199,
    currency: "CAD",
    colors: ["BLACK","WHITE"],
    season: "SP25",
    description: "Crossbody bag in premium leather",
    image: "edith-crossbody.jpg",
    onSale: false,
    url: "https://danier.com/products/edith-crossbody"
  },
  {
    id: 12,
    name: "Edith Satchel",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 249,
    originalPrice: 249,
    currency: "CAD",
    colors: ["BLACK"],
    season: "SP25",
    description: "Satchel bag in premium leather",
    image: "edith-satchel.jpg",
    onSale: false,
    url: "https://danier.com/products/edith-satchel"
  },
  {
    id: 13,
    name: "Willowby Camera Bag",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 159,
    originalPrice: 159,
    currency: "CAD",
    colors: ["BLACK"],
    season: "SP25",
    description: "Camera bag in premium leather",
    image: "willowby-camera-bag.jpg",
    onSale: false,
    url: "https://danier.com/products/willowby-camera-bag"
  },
  {
    id: 14,
    name: "Aria Tote",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 179,
    originalPrice: 179,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Structured tote bag in premium leather",
    image: "aria-tote.jpg",
    onSale: false,
    url: "https://danier.com/products/aria-tote"
  },
  {
    id: 15,
    name: "Nova Backpack",
    category: PRODUCT_CATEGORIES.HANDBAGS,
    price: 189,
    originalPrice: 189,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Leather backpack with laptop compartment",
    image: "nova-backpack.jpg",
    onSale: false,
    url: "https://danier.com/products/nova-backpack"
  },
  {
    id: 16,
    name: "Eliam Laptop Bag",
    category: PRODUCT_CATEGORIES.LAPTOP_BAGS,
    price: 349,
    originalPrice: 349,
    currency: "CAD",
    colors: ["BROWN"],
    season: "SP25",
    description: "Professional laptop carrier in brown leather",
    image: "eliam-laptop-bag.jpg",
    onSale: false,
    url: "https://danier.com/products/eliam-laptop-bag"
  },
  {
    id: 17,
    name: "Charly Laptop Bag",
    category: PRODUCT_CATEGORIES.LAPTOP_BAGS,
    price: 199,
    originalPrice: 199,
    currency: "CAD",
    colors: ["DARK_BROWN"],
    season: "SP25",
    description: "Business laptop bag in dark brown leather",
    image: "charly-laptop-bag.jpg",
    onSale: false,
    url: "https://danier.com/products/charly-laptop-bag"
  },
  {
    id: 18,
    name: "Gilles Laptop Bag",
    category: PRODUCT_CATEGORIES.LAPTOP_BAGS,
    price: 299,
    originalPrice: 299,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Premium laptop bag for business use",
    image: "gilles-laptop-bag.jpg",
    onSale: false,
    url: "https://danier.com/products/gilles-laptop-bag"
  },
  {
    id: 19,
    name: "Voyager Duffel Bag",
    category: PRODUCT_CATEGORIES.TRAVEL,
    price: 129,
    originalPrice: 129,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Durable duffel bag for travel",
    image: "voyager-duffel.jpg",
    onSale: false,
    url: "https://danier.com/products/voyager-duffel-bag"
  },
  {
    id: 20,
    name: "Explorer Backpack",
    category: PRODUCT_CATEGORIES.TRAVEL,
    price: 149,
    originalPrice: 149,
    currency: "CAD",
    colors: ["BLACK","NAVY"],
    season: "SP25",
    description: "Travel backpack with laptop compartment",
    image: "explorer-backpack.jpg",
    onSale: false,
    url: "https://danier.com/products/explorer-backpack"
  },
  {
    id: 21,
    name: "Adventurer Weekender",
    category: PRODUCT_CATEGORIES.TRAVEL,
    price: 199,
    originalPrice: 199,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Weekend travel bag with shoe compartment",
    image: "adventurer-weekender.jpg",
    onSale: false,
    url: "https://danier.com/products/adventurer-weekender"
  },
  {
    id: 22,
    name: "Classic Wallet",
    category: PRODUCT_CATEGORIES.WALLETS,
    price: 89,
    originalPrice: 89,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Classic leather wallet",
    image: "classic-wallet.jpg",
    onSale: false,
    url: "https://danier.com/products/classic-wallet"
  },
  {
    id: 23,
    name: "Bifold Wallet",
    category: PRODUCT_CATEGORIES.WALLETS,
    price: 79,
    originalPrice: 79,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Bifold leather wallet",
    image: "bifold-wallet.jpg",
    onSale: false,
    url: "https://danier.com/products/bifold-wallet"
  },
  {
    id: 24,
    name: "Cardholder",
    category: PRODUCT_CATEGORIES.WALLETS,
    price: 49,
    originalPrice: 49,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Minimalist cardholder",
    image: "cardholder.jpg",
    onSale: false,
    url: "https://danier.com/products/cardholder"
  },
  {
    id: 25,
    name: "Leather Gloves",
    category: PRODUCT_CATEGORIES.GLOVES,
    price: 79,
    originalPrice: 79,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Premium leather gloves",
    image: "leather-gloves.jpg",
    onSale: false,
    url: "https://danier.com/products/leather-gloves"
  },
  {
    id: 26,
    name: "Belt",
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    price: 69,
    originalPrice: 69,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Classic leather belt",
    image: "belt.jpg",
    onSale: false,
    url: "https://danier.com/products/belt"
  },
  {
    id: 27,
    name: "Leather Care Kit",
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    price: 39,
    originalPrice: 39,
    currency: "CAD",
    colors: ["MULTI"],
    season: "SP25",
    description: "Complete leather care and maintenance kit",
    image: "leather-care-kit.jpg",
    onSale: false,
    url: "https://danier.com/products/leather-care-kit"
  },
  {
    id: 28,
    name: "Marcus Messenger Bag",
    category: PRODUCT_CATEGORIES.MENS_MESSENGERS,
    price: 179,
    originalPrice: 179,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Professional messenger bag",
    image: "marcus-messenger.jpg",
    onSale: false,
    url: "https://danier.com/products/marcus-messenger-bag"
  },
  {
    id: 29,
    name: "Nolan Crossbody",
    category: PRODUCT_CATEGORIES.MENS_MESSENGERS,
    price: 129,
    originalPrice: 129,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Compact crossbody bag",
    image: "nolan-crossbody.jpg",
    onSale: false,
    url: "https://danier.com/products/nolan-crossbody"
  },
  {
    id: 30,
    name: "Tyler Briefcase",
    category: PRODUCT_CATEGORIES.MENS_MESSENGERS,
    price: 249,
    originalPrice: 249,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Professional briefcase in premium leather",
    image: "tyler-briefcase.jpg",
    onSale: false,
    url: "https://danier.com/products/tyler-briefcase"
  },
  {
    id: 31,
    name: "Traveler Carry-On",
    category: PRODUCT_CATEGORIES.LUGGAGE,
    price: 299,
    originalPrice: 299,
    currency: "CAD",
    colors: ["BLACK","NAVY"],
    season: "SP25",
    description: "Premium carry-on luggage",
    image: "traveler-carryon.jpg",
    onSale: false,
    url: "https://danier.com/products/traveler-carry-on"
  },
  {
    id: 32,
    name: "Adventurer Check-In",
    category: PRODUCT_CATEGORIES.LUGGAGE,
    price: 399,
    originalPrice: 399,
    currency: "CAD",
    colors: ["BLACK","NAVY"],
    season: "SP25",
    description: "Large check-in luggage",
    image: "adventurer-checkin.jpg",
    onSale: false,
    url: "https://danier.com/products/adventurer-check-in"
  },
  {
    id: 33,
    name: "Explorer Rolling Duffel",
    category: PRODUCT_CATEGORIES.LUGGAGE,
    price: 249,
    originalPrice: 249,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Rolling duffel bag for travel",
    image: "explorer-rolling-duffel.jpg",
    onSale: false,
    url: "https://danier.com/products/explorer-rolling-duffel"
  },
  {
    id: 34,
    name: "Classic Oxford",
    category: PRODUCT_CATEGORIES.SHOES,
    price: 199,
    originalPrice: 199,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Classic oxford shoes in premium leather",
    image: "classic-oxford.jpg",
    onSale: false,
    url: "https://danier.com/products/classic-oxford"
  },
  {
    id: 35,
    name: "Chelsea Boot",
    category: PRODUCT_CATEGORIES.SHOES,
    price: 179,
    originalPrice: 179,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Chelsea boots with elastic side panels",
    image: "chelsea-boot.jpg",
    onSale: false,
    url: "https://danier.com/products/chelsea-boot"
  },
  {
    id: 36,
    name: "Loafers",
    category: PRODUCT_CATEGORIES.SHOES,
    price: 159,
    originalPrice: 159,
    currency: "CAD",
    colors: ["BLACK","BROWN"],
    season: "SP25",
    description: "Comfortable leather loafers",
    image: "loafers.jpg",
    onSale: false,
    url: "https://danier.com/products/loafers"
  }
];

// Helper functions for product filtering and search
export const getProductsBySeason = (season = null) => {
  const currentSeason = season || getCurrentSeason();
  return DANIER_PRODUCTS.filter(product => product.season === currentSeason);
};

export const getProductsByCategory = (category, season = null) => {
  const currentSeason = season || getCurrentSeason();
  return DANIER_PRODUCTS.filter(product => 
    product.category === category && product.season === currentSeason
  );
};

export const searchProducts = (query, season = null) => {
  const currentSeason = season || getCurrentSeason();
  const lowerQuery = query.toLowerCase();
  
  // Split query into words for better matching
  const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 0);
  
  return DANIER_PRODUCTS.filter(product => {
    if (product.season !== currentSeason) return false;
    
    // Check if any query word matches product attributes
    return queryWords.some(word => {
      // Check product name
      if (product.name.toLowerCase().includes(word)) return true;
      
      // Check description
      if (product.description.toLowerCase().includes(word)) return true;
      
      // Check category
      if (product.category.toLowerCase().includes(word)) return true;
      
      // Check colors
      if (product.colors.some(color => color.toLowerCase().includes(word))) return true;
      
      // Check category display name
      const categoryDisplay = getCategoryDisplayName(product.category).toLowerCase();
      if (categoryDisplay.includes(word)) return true;
      
      return false;
    });
  });
};

export const getProductsByPriceRange = (minPrice, maxPrice, season = null) => {
  const currentSeason = season || getCurrentSeason();
  return DANIER_PRODUCTS.filter(product => 
    product.season === currentSeason &&
    product.price >= minPrice &&
    product.price <= maxPrice
  );
};

export const getProductsByColor = (color, season = null) => {
  const currentSeason = season || getCurrentSeason();
  const lowerColor = color.toLowerCase();
  
  return DANIER_PRODUCTS.filter(product => 
    product.season === currentSeason &&
    product.colors.some(productColor => 
      productColor.toLowerCase().includes(lowerColor)
    )
  );
};

// Enhanced price formatting for sale prices
export const formatPrice = (price, currency = "CAD") => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const formatPriceWithSale = (product) => {
  if (product.onSale && product.originalPrice > product.price) {
    return {
      displayPrice: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      onSale: true
    };
  } else {
    return {
      displayPrice: formatPrice(product.price),
      onSale: false
    };
  }
};

export const formatPriceForText = (product) => {
  if (product.onSale && product.originalPrice > product.price) {
    return `${formatPrice(product.price)} (was ${formatPrice(product.originalPrice)})`;
  } else {
    return formatPrice(product.price);
  }
};

export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'jackets': 'Leather Jackets',
    'handbags': 'Handbags',
    'laptop_bags': 'Laptop Bags',
    'travel': 'Travel Bags',
    'accessories': 'Accessories',
    'shoes': 'Shoes',
    'wallets': 'Wallets',
    'gloves': 'Gloves',
    'mens_messengers': 'Men\'s Messenger Bags',
    'luggage': 'Luggage',
    'travel_wear': 'Travel Wear',
    'mens_bags': 'Men\'s Bags',
    'womens_bags': 'Women\'s Bags'
  };
  return categoryMap[category] || category;
};

// URL generation functions
export const generateProductURL = (product) => {
  if (product.url) {
    return product.url;
  }
  
  // Fallback URL generation
  const productSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  return `https://danier.com/products/${productSlug}`;
};

export const generateCategoryURL = (category) => {
  const categoryUrls = {
    'jackets': 'https://danier.com/collections/womens-leather-jackets',
    'handbags': 'https://danier.com/collections/womens-handbags',
    'laptop_bags': 'https://danier.com/collections/mens-laptop-bags',
    'travel': 'https://danier.com/collections/travel-bags',
    'accessories': 'https://danier.com/collections/accessories',
    'shoes': 'https://danier.com/collections/shoes',
    'wallets': 'https://danier.com/collections/wallets',
    'gloves': 'https://danier.com/collections/gloves',
    'mens_messengers': 'https://danier.com/collections/mens-messengers-crossbodies',
    'luggage': 'https://danier.com/collections/luggages',
    'travel_wear': 'https://danier.com/collections/travel-wear',
    'mens_bags': 'https://danier.com/collections/mens-bags',
    'womens_bags': 'https://danier.com/collections/womens-bags'
  };
  
  return categoryUrls[category] || 'https://danier.com/collections';
};

// Base URL for the website
export const baseUrl = 'https://danier.com';
