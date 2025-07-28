const fs = require('fs');
const path = require('path');

// Enhanced color synonyms mapping
const COLOR_SYNONYMS = {
  'black': ['black', 'jet', 'onyx', 'ebony'],
  'brown': ['brown', 'tan', 'chocolate', 'mocha', 'camel', 'coffee', 'walnut', 'cognac', 'hazel', 'taupe', 'bourbon', 'dark brown', 'medium brown', 'british tan'],
  'blue': ['blue', 'navy', 'denim', 'indigo', 'azure', 'mist', 'steel', 'sky', 'aqua', 'teal', 'light blue', 'steel blue'],
  'red': ['red', 'burgundy', 'crimson', 'maroon', 'wine', 'scarlet', 'rose', 'magenta'],
  'white': ['white', 'cream', 'ivory', 'off-white', 'pearl'],
  'green': ['green', 'olive', 'sage', 'mint', 'forest', 'emerald'],
  'grey': ['grey', 'gray', 'charcoal', 'ash', 'slate', 'graphite', 'pewter', 'light grey', 'medium grey'],
  'yellow': ['yellow', 'mustard', 'gold', 'lemon'],
  'pink': ['pink', 'blush', 'rose', 'fuchsia'],
  'purple': ['purple', 'lavender', 'violet', 'plum'],
  'orange': ['orange', 'coral', 'apricot', 'peach'],
  'beige': ['beige', 'sand', 'stone', 'latte'],
  'saddle': ['saddle'],
  'khaki': ['khaki']
};

// Enhanced category mappings with more specific terms
const CATEGORY_MAPPINGS = {
  'jacket': ['jacket', 'coat', 'bomber', 'blazer', 'outerwear', 'moto', 'biker', 'wool coat', 'fur coat', 'teddy bear coat'],
  'handbag': ['handbag', 'bag', 'purse', 'satchel', 'crossbody', 'shoulder bag', 'camera bag', 'laptop bag', 'sling bag', 'messenger bag', 'belt bag', 'duffel bag', 'backpack', 'tote'],
  'wallet': ['wallet', 'cardholder', 'card holder', 'coin purse', 'wristlet', 'clutch'],
  'glove': ['glove', 'gloves'],
  'accessory': ['accessory', 'accessories', 'headband', 'poncho', 'scarf', 'belt', 'hat']
};

// Comprehensive type code to category mapping - ALL 45 type codes mapped
const TYPE_CODE_CATEGORIES = {
  // Jackets/Outerwear (WOW = Women Outerwear, MOW = Men Outerwear)
  'WOWJA': 'jacket', 'MOWJA': 'jacket',  // Jackets
  'WOWCO': 'jacket', 'MOWCO': 'jacket',  // Coats
  'WOWBO': 'jacket', 'MOWBO': 'jacket',  // Bomber jackets
  'WOWTO': 'jacket', 'MOWTO': 'jacket',  // Trench coats
  'WFWBL': 'jacket', 'MFWBL': 'jacket',  // Blazers
  'WFWPA': 'jacket', 'MFWPA': 'jacket',  // Pants (outerwear)
  'WFWSK': 'jacket', 'MFWSK': 'jacket',  // Skirts (outerwear)
  'WFWTO': 'jacket', 'MFWTO': 'jacket',  // Tops (outerwear)
  'WFWDR': 'jacket', 'MFWDR': 'jacket',  // Dresses (outerwear)
  'WFWVE': 'jacket', 'MFWVE': 'jacket',  // Vests (outerwear)
  'WFWDE': 'jacket', 'MFWDE': 'jacket',  // Denim (outerwear)
  'WFWSF': 'jacket', 'MFWSF': 'jacket',  // Shirts (outerwear)
  
  // Knitwear (separate from jackets)
  'WFWKN': 'accessory', 'MFWKN': 'accessory',  // Knitwear
  
  // Handbags (WAC = Women Accessories, MAC = Men Accessories)
  'WACHB': 'handbag', 'MACMB': 'handbag',  // Handbags
  'WACSA': 'handbag', 'MACSA': 'handbag',  // Satchels
  'WACCB': 'handbag', 'MACCB': 'handbag',  // Crossbody bags
  'WACSH': 'handbag', 'MACSH': 'handbag',  // Shoulder bags
  'WACCA': 'handbag', 'MACCA': 'handbag',  // Camera bags
  'WACBA': 'handbag', 'MACBA': 'handbag',  // Backpacks
  'WACTO': 'handbag', 'MACTO': 'handbag',  // Totes
  'WACME': 'handbag', 'MACME': 'handbag',  // Messenger bags
  'WACDU': 'handbag', 'MACDU': 'handbag',  // Duffel bags
  
  // Wallets (WACWA = Women Accessories Wallet, MACWA = Men Accessories Wallet)
  'WACWA': 'wallet', 'MACWA': 'wallet',  // Wallets
  'WACWR': 'wallet', 'MACWR': 'wallet',  // Wristlets
  'WACCL': 'wallet', 'MACCL': 'wallet',  // Clutches
  
  // Gloves (WACGL = Women Accessories Gloves, MACGL = Men Accessories Gloves)
  'WACGL': 'glove', 'MACGL': 'glove',  // Gloves
  
  // Accessories (WACHA = Women Accessories Hat, etc.)
  'WACHA': 'accessory', 'MACHA': 'accessory',  // Hats
  'WACSC': 'accessory', 'MACSC': 'accessory',  // Scarves
  'WACPO': 'accessory', 'MACPO': 'accessory',  // Ponchos
  'WACBE': 'accessory', 'MACBE': 'accessory',  // Belt bags (accessories)
  
  // Travel/Other (UTR = Universal Travel, UCP = Universal Care Products)
  'UTRHL': 'handbag',  // Travel handbags
  'UTRTB': 'handbag',  // Travel backpacks
  'UCPWI': 'accessory',  // Care products
  'UACWH': 'accessory',  // Universal accessories
  
  // Men's specific (MTR = Men Travel)
  'MTRWC': 'handbag',  // Men travel wallets
  'MTRTB': 'handbag',  // Men travel bags
  'MTRJC': 'jacket',   // Men jackets
  'MTRCC': 'jacket',   // Men coats
  
  // Women's specific (WTR = Women Travel)
  'WTRTB': 'handbag',  // Women travel bags
  'WTRJC': 'jacket',   // Women jackets
  'WTRCC': 'jacket',   // Women coats
  
  // Special categories
  'ALL SEASON': 'jacket',  // All season outerwear
  'CARE PRODUCT': 'accessory'  // Care products
};

// Gender code mapping
const GENDER_CODE_MAP = {
  'M': 'Men',
  'W': 'Women',
  'U': 'Unisex'
};

function inferGender(product) {
  // First check if gender is already set from CSV processing
  if (product.gender && product.gender !== 'Unisex' && product.gender !== 'unknown') {
    return product.gender;
  }
  
  if (product.type && typeof product.type === 'string') {
    const code = product.type.trim().toUpperCase();
    // Check if type code starts with M (Men) or W (Women)
    if (code.startsWith('M')) {
      return 'Men';
    } else if (code.startsWith('W')) {
      return 'Women';
    }
  }
  
  // Enhanced text analysis with more fields
  const fields = [
    product.title, 
    product.category, 
    product.originalTags,
    ...(product.tags || [])
  ];
  
  for (const field of fields) {
    if (!field) continue;
    const f = field.toLowerCase();
    
    // More specific gender detection
    if (f.includes('women') || f.includes('ladies') || f.includes('womens') || f.includes("women's")) {
      return 'Women';
    }
    if (f.includes('men') && !f.includes('women')) { // Avoid "women" containing "men"
      return 'Men';
    }
    if (f.includes('mens') || f.includes("men's")) {
      return 'Men';
    }
  }
  
  // Default to Unisex for broader inclusion
  return 'Unisex';
}

function colorMatches(productColors, userColor) {
  if (!userColor) return true;
  const synonyms = COLOR_SYNONYMS[userColor.toLowerCase()] || [userColor.toLowerCase()];
  return (productColors || []).some(prodColor => {
    if (!prodColor) return false;
    const prod = prodColor.toLowerCase();
    return synonyms.some(syn => prod.includes(syn));
  });
}

function categoryMatches(product, userCategory) {
  if (!userCategory) return true;
  
  const cat = userCategory.toLowerCase();
  
  // 🚀 STRICT CATEGORY FILTERING: Only exact category matches allowed
  if (product.type && TYPE_CODE_CATEGORIES[product.type.toUpperCase()]) {
    const productCategory = TYPE_CODE_CATEGORIES[product.type.toUpperCase()];
    
    // Direct category match (jacket -> jacket, handbag -> handbag, etc.)
    if (cat.includes('jacket') || cat.includes('coat') || cat.includes('blazer') || cat.includes('bomber')) {
      return productCategory === 'jacket';
    }
    if (cat.includes('bag') || cat.includes('handbag') || cat.includes('purse') || cat.includes('satchel') || cat.includes('crossbody')) {
      return productCategory === 'handbag';
    }
    if (cat.includes('wallet') || cat.includes('cardholder')) {
      return productCategory === 'wallet';
    }
    if (cat.includes('glove')) {
      return productCategory === 'glove';
    }
    
    // For other categories, use the existing synonym matching
    if (CATEGORY_MAPPINGS[productCategory]) {
      return CATEGORY_MAPPINGS[productCategory].some(catSyn => cat.includes(catSyn));
    }
  }
  
  // Fallback: check title for direct matches only
  if (product.title) {
    const titleLower = product.title.toLowerCase();
    if (cat.includes('jacket') && (titleLower.includes('jacket') || titleLower.includes('coat') || titleLower.includes('blazer'))) {
      return true;
    }
  }
  
  return false;
}

function extractPriceRange(query) {
  const q = query.toLowerCase();
  const pricePatterns = [
    { pattern: /under\s+\$?(\d+)/, type: 'under', value: null },
    { pattern: /over\s+\$?(\d+)/, type: 'over', value: null },
    { pattern: /less\s+than\s+\$?(\d+)/, type: 'under', value: null },
    { pattern: /more\s+than\s+\$?(\d+)/, type: 'over', value: null },
    { pattern: /(\d+)\s*-\s*(\d+)/, type: 'range', min: null, max: null },
    { pattern: /between\s+\$?(\d+)\s+and\s+\$?(\d+)/, type: 'range', min: null, max: null }
  ];
  
  for (const pattern of pricePatterns) {
    const match = q.match(pattern.pattern);
    if (match) {
      if (pattern.type === 'range') {
        pattern.min = parseInt(match[1]);
        pattern.max = parseInt(match[2]);
        return { type: 'range', min: pattern.min, max: pattern.max };
      } else {
        pattern.value = parseInt(match[1]);
        return { type: pattern.type, value: pattern.value };
      }
    }
  }
  
  return null;
}

function priceMatches(product, priceRange) {
  if (!priceRange) return true;
  
  const price = product.salePrice || product.originalPrice;
  
  switch (priceRange.type) {
    case 'under':
      return price < priceRange.value;
    case 'over':
      return price > priceRange.value;
    case 'range':
      return price >= priceRange.min && price <= priceRange.max;
    default:
      return true;
  }
}

class ProductSearchService {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const productsPath = path.join(__dirname, '../src/data/processed-products.json');
      if (fs.existsSync(productsPath)) {
        this.products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        console.log(`✅ Loaded ${this.products.length} products from CSV data`);
      } else {
        console.warn('⚠️ Processed products file not found. Run the CSV processor first.');
        this.products = [];
      }
    } catch (error) {
      console.error('❌ Error loading product data:', error);
      this.products = [];
    }
  }

  // Enhanced filter extraction
  extractFilters(query) {
    const q = query.toLowerCase();
    let color = null, category = null, gender = null, priceRange = null;
    
    // Extract price range first
    priceRange = extractPriceRange(query);
    
    // Extract color
    for (const [colorKey, synonyms] of Object.entries(COLOR_SYNONYMS)) {
      if (synonyms.some(syn => q.includes(syn))) {
        color = colorKey;
        break;
      }
    }
    
    // Extract gender - fixed to avoid substring matching
    if (q.includes('women') || q.includes('womens') || q.includes("women's") || q.includes('ladies')) {
      gender = 'Women';
    } else if (q.includes('men') || q.includes('mens') || q.includes("men's")) {
      gender = 'Men';
    }
    
    // Extract category - much more lenient logic to prevent over-filtering
    // Only set category for very specific searches, otherwise keep it broad
    const words = q.split(/\s+/);
    
    // Only set category for very specific searches like "women's leather jackets" or "men's wallets"
    // Don't set category for general searches like "red handbags" or "black bags"
    if (q.includes('women') && (q.includes('jacket') || q.includes('coat') || q.includes('outerwear'))) {
      category = 'jacket';
    } else if (q.includes('men') && (q.includes('jacket') || q.includes('coat') || q.includes('outerwear'))) {
      category = 'jacket';
    } else if (q.includes('women') && q.includes('wallet')) {
      category = 'wallet';
    } else if (q.includes('men') && q.includes('wallet')) {
      category = 'wallet';
    } else {
      // Don't set category for general searches - this allows more products to show up
      // For example, "red handbags" will show all red products that could be handbags
      category = null;
    }
    
    return { color, category, gender, priceRange };
  }

  // Main search function with enhanced filtering
  search(query, limit = 10) {
    if (!query || !query.trim()) {
      return {
        products: this.products.slice(0, limit),
        total: this.products.length,
        query,
        searchType: 'all'
      };
    }
    
    const { color, category, gender, priceRange } = this.extractFilters(query);
    console.log(`\n[DEBUG] Search Query: "${query}" | Color: ${color} | Category: ${category} | Gender: ${gender} | Price: ${priceRange ? JSON.stringify(priceRange) : 'any'}`);
    
    let results = [];
    for (const product of this.products) {
      const inferredGender = inferGender(product);
      
      // FIXED: Much more lenient gender matching
      let genderMatch = true;
      if (gender) {
        if (gender === 'Women') {
          // For women's searches, include Women products AND Unisex products
          genderMatch = (inferredGender === 'Women' || inferredGender === 'Unisex');
        } else if (gender === 'Men') {
          // For men's searches, include Men products AND Unisex products
          genderMatch = (inferredGender === 'Men' || inferredGender === 'Unisex');
        } else {
          genderMatch = (inferredGender === gender);
        }
      }
      
      const categoryMatch = !category || categoryMatches(product, category);
      const colorMatch = !color || colorMatches(product.colors, color);
      const priceMatch = !priceRange || priceMatches(product, priceRange);
      
      if (!genderMatch) {
        console.log(`[DEBUG] SKIP: "${product.title}" (type: ${product.type}) - Gender mismatch (${inferredGender})`);
        continue;
      }
      if (!categoryMatch) {
        console.log(`[DEBUG] SKIP: "${product.title}" (type: ${product.type}) - Category mismatch`);
        continue;
      }
      if (!colorMatch) {
        console.log(`[DEBUG] SKIP: "${product.title}" (type: ${product.type}) - Color mismatch (${product.colors})`);
        continue;
      }
      if (!priceMatch) {
        console.log(`[DEBUG] SKIP: "${product.title}" (type: ${product.type}) - Price mismatch ($${product.salePrice})`);
        continue;
      }
      
      console.log(`[DEBUG] MATCH: "${product.title}" (type: ${product.type}) | Colors: ${product.colors} | Gender: ${inferredGender} | Price: $${product.salePrice}`);
      results.push(product);
    }
    
    // Sort results by relevance and price
    results.sort((a, b) => {
      // Prioritize products on sale
      const aOnSale = a.isOnSale ? 1 : 0;
      const bOnSale = b.isOnSale ? 1 : 0;
      if (aOnSale !== bOnSale) return bOnSale - aOnSale;
      
      // Then by price (lower first)
      return a.salePrice - b.salePrice;
    });
    
    return {
      products: results.slice(0, limit),
      total: results.length,
      query,
      searchType: 'filtered',
      filters: { color, category, gender, priceRange }
    };
  }

  generateSearchResponse(searchResult) {
    const { products, total, query, filters } = searchResult;
    
    if (total === 0) {
      let response = `**No products found** with your current filters:\n\n`;
      if (filters) {
        response += `• Color: ${filters.color || 'any'}\n`;
        response += `• Category: ${filters.category || 'any'}\n`;
        response += `• Gender: ${filters.gender || 'any'}\n`;
        if (filters.priceRange) {
          if (filters.priceRange.type === 'range') {
            response += `• Price: $${filters.priceRange.min} - $${filters.priceRange.max}\n`;
          } else {
            response += `• Price: ${filters.priceRange.type} $${filters.priceRange.value}\n`;
          }
        }
      }
      response += `\n💡 **Suggestions:**\n`;
      response += `• Try adjusting your filters\n`;
      response += `• Browse our [full collection](https://danier.com/collections)\n`;
      response += `• Ask me for recommendations!`;
      return response;
    }
    
    let response = `**Found ${total} products matching your criteria:**\n\n`;
    if (filters) {
      response += `• Color: ${filters.color || 'any'}\n`;
      response += `• Category: ${filters.category || 'any'}\n`;
      response += `• Gender: ${filters.gender || 'any'}\n`;
      if (filters.priceRange) {
        if (filters.priceRange.type === 'range') {
          response += `• Price: $${filters.priceRange.min} - $${filters.priceRange.max}\n`;
        } else {
          response += `• Price: ${filters.priceRange.type} $${filters.priceRange.value}\n`;
        }
      }
      response += `\n`;
    }
    
    products.forEach((product, index) => {
      // Debug: Log the first product to see its structure
      if (index === 0) {
        console.log('🔍 DEBUG: First product structure:');
        console.log('  - title:', product.title);
        console.log('  - salePrice:', product.salePrice);
        console.log('  - originalPrice:', product.originalPrice);
        console.log('  - url:', product.url);
        console.log('  - colors:', product.colors);
        console.log('  - Full object keys:', Object.keys(product));
      }
      
      const title = product.title || product.name || product.Title || product.Name || 'Unknown Product';
      const price = product.salePrice || product.price || product.Price || product.SalePrice || 0;
      const originalPrice = product.originalPrice || product.originalPrice || product.OriginalPrice || price;
      const colors = product.colors || product.color || product.Colors || product.Color || '';
      const gender = product.gender || product.Gender || '';
      
      response += `• **${title}** - $${price}`;
      if (colors) {
        response += ` (${colors})`;
      }
      if (gender) {
        response += ` - ${gender}`;
      }
      if (originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        response += ` (was $${originalPrice}, ${discount}% off)`;
      }
      if (product.url || product.URL) {
        response += ` [View](${product.url || product.URL})`;
      }
      response += `\n`;
    });
    
    if (total > products.length) {
      response += `\n*Showing ${products.length} of ${total} results. Refine your search for more specific results.*`;
    }
    
    return response;
  }

  // New method for getting product recommendations
  getRecommendations(category = null, gender = null, limit = 5) {
    let results = this.products.filter(product => {
      const inferredGender = inferGender(product);
      const genderMatch = !gender || inferredGender === gender;
      const categoryMatch = !category || categoryMatches(product, category);
      return genderMatch && categoryMatch;
    });
    
    // Sort by popularity (on sale items first, then by price)
    results.sort((a, b) => {
      const aOnSale = a.isOnSale ? 1 : 0;
      const bOnSale = b.isOnSale ? 1 : 0;
      if (aOnSale !== bOnSale) return bOnSale - aOnSale;
      return a.salePrice - b.salePrice;
    });
    
    return results.slice(0, limit);
  }

  // New method for getting trending products
  getTrendingProducts(limit = 5) {
    // For now, return products on sale as "trending"
    const trending = this.products.filter(product => product.isOnSale);
    trending.sort((a, b) => b.discount - a.discount);
    return trending.slice(0, limit);
  }
}

// Export the class and helper functions
module.exports = ProductSearchService;
module.exports.inferGender = inferGender;
module.exports.categoryMatches = categoryMatches;
module.exports.colorMatches = colorMatches;