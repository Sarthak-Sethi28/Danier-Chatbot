const fs = require('fs');
const path = require('path');

// Enhanced color synonyms mapping
const COLOR_SYNONYMS = {
  'black': ['black', 'jet', 'onyx', 'ebony'],
  'brown': ['brown', 'tan', 'chocolate', 'mocha', 'camel', 'coffee', 'walnut', 'cognac', 'hazel', 'taupe', 'bourbon', 'dark brown', 'medium brown', 'british tan'],
  'blue': ['blue', 'navy', 'denim', 'indigo', 'azure', 'mist', 'steel', 'sky', 'aqua', 'teal', 'light blue', 'steel blue'],
  'red': ['red', 'burgundy', 'crimson', 'maroon', 'wine', 'scarlet', 'rose', 'magenta', 'deep red', 'dark red'],
  'white': ['white', 'cream', 'ivory', 'off-white', 'pearl', 'ecru'],
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
  // Check explicit gender field
  if (product.gender) {
    const gender = product.gender.toLowerCase();
    if (gender.includes('women') || gender.includes('female')) return 'W';
    if (gender.includes('men') || gender.includes('male')) return 'M';
  }
  
  // Check category for gender
  if (product.category) {
    if (product.category.includes('womens')) return 'W';
    if (product.category.includes('mens')) return 'M';
  }
  
  // Check type code
  if (product.type) {
    const typeCode = product.type.toUpperCase();
    if (typeCode.startsWith('M')) return 'M';
    if (typeCode.startsWith('W')) return 'W';
    if (typeCode.startsWith('U')) return 'U';
  }
  
  // Default to unisex
  return 'U';
}

function colorMatches(productColors, userColor) {
  if (!productColors || productColors.length === 0) return false;
  
  const userColorLower = userColor.toLowerCase();
  const colorVariations = COLOR_SYNONYMS[userColorLower] || [userColorLower];
  
  return productColors.some(productColor => {
    const productColorLower = productColor.toLowerCase();
    return colorVariations.some(variation => 
      productColorLower.includes(variation.toLowerCase())
    );
  });
}

function categoryMatches(product, userCategory) {
  const userCategoryLower = userCategory.toLowerCase();
  
  // Check if user category matches any of the mapped categories
  for (const [category, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some(keyword => userCategoryLower.includes(keyword))) {
      // Special handling for wallets - check product name and search keywords
      if (category === 'wallet') {
        const productName = (product.name || '').toLowerCase();
        const searchKeywords = (product.search_keywords || []).join(' ').toLowerCase();
        const productText = `${productName} ${searchKeywords}`;
        
        if (productText.includes('wallet') || productText.includes('cardholder')) {
          return true;
        }
        
        // Check if it's in accessories category and contains wallet-related terms
        if (product.category && product.category.includes('accessories') && 
            (productText.includes('wallet') || productText.includes('cardholder'))) {
          return true;
        }
      }
      
      // Special handling for handbags - check product name and search keywords
      if (category === 'handbag') {
        const productName = (product.name || '').toLowerCase();
        const searchKeywords = (product.search_keywords || []).join(' ').toLowerCase();
        const productText = `${productName} ${searchKeywords}`;
        
        if (productText.includes('bag') || productText.includes('handbag') || 
            productText.includes('purse') || productText.includes('tote') || 
            productText.includes('satchel') || productText.includes('crossbody')) {
          return true;
        }
        
        // Check if it's in handbags category
        if (product.category && product.category.includes('handbag')) {
          return true;
        }
      }
      
      // Check if product matches this category
      if (product.category && product.category.toLowerCase().includes(category)) {
        return true;
      }
      
      // Check type code mapping
      if (product.type && TYPE_CODE_CATEGORIES[product.type.toUpperCase()] === category) {
        return true;
      }
    }
  }
  
  // Direct category matching
  if (product.category && product.category.toLowerCase().includes(userCategoryLower)) {
    return true;
  }
  
  return false;
}

function extractPriceRange(query) {
  const pricePatterns = [
    { pattern: /under \$?(\d+)/i, type: 'under' },
    { pattern: /below \$?(\d+)/i, type: 'under' },
    { pattern: /less than \$?(\d+)/i, type: 'under' },
    { pattern: /over \$?(\d+)/i, type: 'over' },
    { pattern: /above \$?(\d+)/i, type: 'over' },
    { pattern: /more than \$?(\d+)/i, type: 'over' },
    { pattern: /between \$?(\d+) and \$?(\d+)/i, type: 'range' },
    { pattern: /\$?(\d+)-\$?(\d+)/i, type: 'range' },
    { pattern: /around \$?(\d+)/i, type: 'around' }
  ];

  for (const { pattern, type } of pricePatterns) {
    const match = query.match(pattern);
    if (match) {
      if (type === 'range') {
        return {
          min: parseInt(match[1]),
          max: parseInt(match[2])
        };
      } else if (type === 'around') {
        const price = parseInt(match[1]);
        return {
          min: price - 50,
          max: price + 50
        };
      } else {
        return {
          type,
          value: parseInt(match[1])
        };
      }
    }
  }
  
  return null;
}

function priceMatches(product, priceRange) {
  if (!product.price || !priceRange) return true;
  
  if (priceRange.type === 'under') {
    return product.price < priceRange.value;
  } else if (priceRange.type === 'over') {
    return product.price > priceRange.value;
  } else if (priceRange.min !== undefined && priceRange.max !== undefined) {
    return product.price >= priceRange.min && product.price <= priceRange.max;
  }
  
  return true;
}

class OptimizedProductSearchService {
  constructor() {
    this.products = [];
    this.searchIndex = null;
    this.initialized = false;
  }

  loadProducts() {
    try {
      // Try to load from the latest smart products file
      const productsPath = path.join(__dirname, '../src/data/latest-smart-products.json');
      if (fs.existsSync(productsPath)) {
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        this.products = (productsData.products || []).map(product => {
          // Ensure price accuracy
          const currentPrice = product.price || 0;
          const originalPrice = product.originalPrice || currentPrice;
          const isOnSale = product.onSale || (originalPrice > currentPrice);
          
          return {
            ...product,
            price: currentPrice,
            originalPrice: isOnSale ? originalPrice : null,
            onSale: isOnSale,
            gender: inferGender(product),
            colors: product.colors || [],
            search_keywords: product.search_keywords || []
          };
        });
        
        console.log(`✅ Loaded ${this.products.length} products from latest-smart-products.json`);
        this.buildSearchIndex();
        this.initialized = true;
        return;
      }
      
      // Fallback to other product files
      const fallbackPaths = [
        path.join(__dirname, '../src/data/complete-smart-products.json'),
        path.join(__dirname, '../src/data/smart-products.json'),
        path.join(__dirname, '../src/data/processed-products.json')
      ];
      
      for (const fallbackPath of fallbackPaths) {
        if (fs.existsSync(fallbackPath)) {
          const productsData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
          this.products = (productsData.products || []).map(product => ({
            ...product,
            gender: inferGender(product),
            colors: product.colors || [],
            search_keywords: product.search_keywords || []
          }));
          
          console.log(`✅ Loaded ${this.products.length} products from ${path.basename(fallbackPath)}`);
          this.buildSearchIndex();
          this.initialized = true;
          return;
        }
      }
      
      console.log('⚠️ No product data files found');
      this.products = [];
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      this.products = [];
    }
  }

  buildSearchIndex() {
    this.searchIndex = {
      byKeywords: {},
      byCategory: {},
      byColor: {},
      byGender: {},
      byPriceRange: {}
    };
    
    this.products.forEach(product => {
      // Index by keywords
      const allKeywords = [
        product.name.toLowerCase(),
        product.category.toLowerCase(),
        ...(product.colors || []).map(c => c.toLowerCase()),
        ...(product.search_keywords || []).map(k => k.toLowerCase())
      ];
      
      allKeywords.forEach(keyword => {
        if (!this.searchIndex.byKeywords[keyword]) {
          this.searchIndex.byKeywords[keyword] = [];
        }
        this.searchIndex.byKeywords[keyword].push(product.id);
      });
      
      // Index by category
      if (!this.searchIndex.byCategory[product.category]) {
        this.searchIndex.byCategory[product.category] = [];
      }
      this.searchIndex.byCategory[product.category].push(product.id);
      
      // Index by color
      (product.colors || []).forEach(color => {
        const colorKey = color.toLowerCase();
        if (!this.searchIndex.byColor[colorKey]) {
          this.searchIndex.byColor[colorKey] = [];
        }
        this.searchIndex.byColor[colorKey].push(product.id);
      });
      
      // Index by gender
      if (!this.searchIndex.byGender[product.gender]) {
        this.searchIndex.byGender[product.gender] = [];
      }
      this.searchIndex.byGender[product.gender].push(product.id);
    });
  }

  extractFilters(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const filters = {
      category: null,
      colors: [],
      priceRange: null,
      gender: null,
      onSale: null
    };

    // Extract category
    for (const [category, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        filters.category = category;
        break;
      }
    }

    // Extract colors
    for (const [color, variations] of Object.entries(COLOR_SYNONYMS)) {
      if (variations.some(variation => normalizedQuery.includes(variation))) {
        filters.colors.push(color);
      }
    }

    // Extract price range
    filters.priceRange = extractPriceRange(normalizedQuery);

    // Extract gender
    const hasWomen = /\b(women|woman|ladies|womens)\b/i.test(normalizedQuery);
    const hasMen = /\b(mens?|man)\b/i.test(normalizedQuery) && !hasWomen;
    
    if (hasWomen) {
      filters.gender = 'W';
    } else if (hasMen) {
      filters.gender = 'M';
    }

    // Extract sale status
    if (normalizedQuery.includes('sale') || normalizedQuery.includes('discount') || normalizedQuery.includes('reduced')) {
      filters.onSale = true;
    }

    return filters;
  }

  search(query, limit = 100) {
    if (!this.initialized) {
      this.loadProducts();
    }

    console.log(`🔍 Optimized search for: "${query}"`);
    
    const filters = this.extractFilters(query);
    const searchWords = query.toLowerCase().split(' ').filter(word => word.length > 0);
    
    let results = this.products.filter(product => {
      // Filter out products with $0 price or missing price
      if (!product.price || product.price <= 0) {
        return false;
      }
      
      // Apply filters
      if (filters.category && !categoryMatches(product, filters.category)) {
        return false;
      }
      
      if (filters.colors.length > 0 && !filters.colors.some(color => colorMatches(product.colors, color))) {
        return false;
      }
      
      if (filters.priceRange && !priceMatches(product, filters.priceRange)) {
        return false;
      }
      
      if (filters.gender && product.gender !== filters.gender && product.gender !== 'U') {
        return false;
      }
      
      if (filters.onSale && !product.onSale) {
        return false;
      }
      
      // Apply search terms
      if (searchWords.length > 0) {
        const searchableText = [
          product.name || '',
          product.category || '',
          ...(product.colors || []),
          ...(product.search_keywords || [])
        ].join(' ').toLowerCase();
        
        return searchWords.some(word => searchableText.includes(word));
      }
      
      return true;
    });
    
    // Remove duplicates based on product name and URL
    const seen = new Set();
    results = results.filter(product => {
      const key = `${product.name}-${product.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    
    // Sort by relevance
    results = this.sortByRelevance(results, searchWords);
    
    return {
      products: results.slice(0, limit),
      total: results.length,
      filters: filters,
      searchType: 'optimized'
    };
  }

  sortByRelevance(products, searchWords) {
    return products.sort((a, b) => {
      // Priority 1: Exact title matches
      const aExactTitle = searchWords.every(word => a.name.toLowerCase().includes(word));
      const bExactTitle = searchWords.every(word => b.name.toLowerCase().includes(word));
      if (aExactTitle && !bExactTitle) return -1;
      if (!aExactTitle && bExactTitle) return 1;
      
      // Priority 2: Products with more words in title
      const aWordsInTitle = searchWords.filter(word => a.name.toLowerCase().includes(word)).length;
      const bWordsInTitle = searchWords.filter(word => b.name.toLowerCase().includes(word)).length;
      if (aWordsInTitle !== bWordsInTitle) return bWordsInTitle - aWordsInTitle;
      
      // Priority 3: On-sale items
      if (a.onSale && !b.onSale) return -1;
      if (!a.onSale && b.onSale) return 1;
      
      // Priority 4: In-stock items
      if (a.in_stock && !b.in_stock) return -1;
      if (!a.in_stock && b.in_stock) return 1;
      
      // Priority 5: Lower price
      return (a.price || 999999) - (b.price || 999999);
    });
  }

  generateSearchResponse(searchResult) {
    const { products, total, filters } = searchResult;
    
    if (products.length === 0) {
      return "I couldn't find any products matching your search. Try adjusting your criteria or browse our categories.";
    }
    
    let response = `I found ${total} product${total === 1 ? '' : 's'} matching your search:\n\n`;
    
    // Add filter summary if filters are active
    const filterSummary = [];
    if (filters.category) filterSummary.push(`• Category: ${filters.category}`);
    if (filters.colors.length > 0) filterSummary.push(`• Colors: ${filters.colors.join(', ')}`);
    if (filters.gender) filterSummary.push(`• Gender: ${GENDER_CODE_MAP[filters.gender]}`);
    if (filters.onSale) filterSummary.push(`• On Sale: Yes`);
    
    if (filterSummary.length > 0) {
      response += `**Applied Filters:**\n${filterSummary.join('\n')}\n\n`;
    }
    
    // Show products with accurate pricing
    products.forEach(product => {
      response += `• **${product.name}** - `;
      
      // Accurate price display
      if (product.onSale && product.originalPrice && product.originalPrice > product.price) {
        response += `~~$${product.originalPrice}~~ **$${product.price}** `;
        const savings = product.originalPrice - product.price;
        response += `*(Save $${savings}!)* `;
      } else if (product.price) {
        response += `$${product.price} `;
      }
      
      // Color display
      if (product.colors && product.colors.length > 0) {
        response += `- Available in: ${product.colors.join(', ')} `;
      }
      
      // Category display
      response += `- ${product.category.replace('_', ' ')} `;
      
      // View link
      response += `[View Product](${product.url})\n`;
    });
    
    if (total > products.length) {
      response += `\n*Showing ${products.length} of ${total} products. Refine your search for more specific results.*`;
    }
    
    return response;
  }

  getRecommendations(category = null, gender = null, limit = 5) {
    let recommendations = this.products.filter(product => {
      if (category && !categoryMatches(product, category)) return false;
      if (gender && product.gender !== gender && product.gender !== 'U') return false;
      return product.in_stock !== false;
    });
    
    // Sort by relevance (on-sale items first, then by price)
    recommendations = recommendations.sort((a, b) => {
      if (a.onSale && !b.onSale) return -1;
      if (!a.onSale && b.onSale) return 1;
      return (a.price || 999999) - (b.price || 999999);
    });
    
    return recommendations.slice(0, limit);
  }

  getTrendingProducts(limit = 5) {
    // For now, return products that are on sale
    const trending = this.products
      .filter(product => product.onSale && product.in_stock !== false)
      .sort((a, b) => {
        // Sort by discount percentage
        const aDiscount = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
        const bDiscount = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
        return bDiscount - aDiscount;
      });
    
    return trending.slice(0, limit);
  }

  getProductStats() {
    const stats = {
      total: this.products.length,
      categories: {},
      priceRanges: {},
      onSale: 0,
      inStock: 0
    };
    
    this.products.forEach(product => {
      // Category stats
      if (!stats.categories[product.category]) {
        stats.categories[product.category] = 0;
      }
      stats.categories[product.category]++;
      
      // Price range stats
      const priceRange = this.getPriceRange(product.price);
      if (!stats.priceRanges[priceRange]) {
        stats.priceRanges[priceRange] = 0;
      }
      stats.priceRanges[priceRange]++;
      
      // Sale and stock stats
      if (product.onSale) stats.onSale++;
      if (product.in_stock) stats.inStock++;
    });
    
    return stats;
  }

  getPriceRange(price) {
    if (price <= 100) return 'under_100';
    if (price <= 200) return '100_200';
    if (price <= 300) return '200_300';
    if (price <= 500) return '300_500';
    if (price <= 1000) return '500_1000';
    return 'over_1000';
  }
}

module.exports = OptimizedProductSearchService; 