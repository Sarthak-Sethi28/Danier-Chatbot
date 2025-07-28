class OptimizedProductSearchService {
  constructor() {
    this.products = [];
    this.searchIndex = null;
    this.filters = {
      category: null,
      colors: [],
      priceRange: null,
      gender: null,
      inStock: null,
      onSale: null
    };
    this.initialized = false;
    
    // Enhanced color mapping for better matching
    this.colorMap = {
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
    
    // Comprehensive category mapping
    this.categoryMap = {
      'mens_jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'vest', 'knitwear', 'men', 'mens'],
      'womens_jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'vest', 'knitwear', 'women', 'womens'],
      'jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'reversible'],
      'womens_handbags': ['handbag', 'bag', 'purse', 'tote', 'satchel', 'crossbody', 'shoulder', 'bucket', 'clutch', 'women', 'womens'],
      'handbags': ['handbag', 'bag', 'purse', 'tote', 'satchel', 'crossbody', 'shoulder', 'bucket', 'clutch'],
      'womens_accessories': ['wallet', 'cardholder', 'gloves', 'belt', 'scarf', 'hat', 'accessories', 'women', 'womens'],
      'mens_accessories': ['wallet', 'cardholder', 'messenger', 'briefcase', 'gloves', 'belt', 'hat', 'accessories', 'men', 'mens'],
      'wallets': ['wallet', 'bifold', 'cardholder', 'card holder'],
      'travel_luggage': ['travel', 'luggage', 'suitcase', 'duffel', 'weekender', 'travel bag'],
      'care_products': ['care', 'cleaner', 'conditioner', 'polish', 'maintenance'],
      'gloves': ['gloves', 'mittens'],
      'accessories': ['belt', 'accessory', 'care kit', 'scarf', 'hat'],
      'shoes': ['shoe', 'boot', 'sneaker', 'loafer']
    };
  }

  /**
   * Initialize the service with the latest product data
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Optimized Product Search Service...');
      
      // Load the latest product data
      const productsResponse = await fetch('/latest-smart-products.json');
      const productsData = await productsResponse.json();
      
      // Transform and enhance product data
      this.products = (productsData.products || []).map((product) => {
        // Ensure price accuracy
        const currentPrice = product.price || 0;
        const originalPrice = product.originalPrice || currentPrice;
        const isOnSale = product.onSale || (originalPrice > currentPrice);
        
        return {
          id: product.id,
          name: product.name,
          title: product.name,
          category: product.category,
          price: currentPrice,
          salePrice: currentPrice,
          originalPrice: isOnSale ? originalPrice : null,
          colors: product.colors || [],
          description: product.description || '',
          url: product.url,
          imageUrl: product.image_url || product.image,
          onSale: isOnSale,
          isOnSale: isOnSale,
          in_stock: product.in_stock !== false, // Default to true if not specified
          gender: this.extractGender(product),
          search_keywords: product.search_keywords || [],
          type: product.type,
          season: product.season,
          lastUpdated: product.lastUpdated
        };
      });
      
      // Create optimized search index
      this.buildSearchIndex();
      
      this.initialized = true;
      console.log(`✅ Optimized Search Service initialized with ${this.products.length} products`);
      console.log(`📊 Categories: ${[...new Set(this.products.map(p => p.category))].join(', ')}`);
      
    } catch (error) {
      console.error('❌ Error initializing Optimized Search Service:', error);
      this.products = [];
      this.searchIndex = {};
      this.initialized = false;
    }
  }

  /**
   * Extract gender from product data
   */
  extractGender(product) {
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

  /**
   * Build optimized search index
   */
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
      
      // Index by price range
      const priceRange = this.getPriceRange(product.price);
      if (!this.searchIndex.byPriceRange[priceRange]) {
        this.searchIndex.byPriceRange[priceRange] = [];
      }
      this.searchIndex.byPriceRange[priceRange].push(product.id);
    });
  }

  /**
   * Get price range category
   */
  getPriceRange(price) {
    if (price <= 100) return 'under_100';
    if (price <= 200) return '100_200';
    if (price <= 300) return '200_300';
    if (price <= 500) return '300_500';
    if (price <= 1000) return '500_1000';
    return 'over_1000';
  }

  /**
   * Main search method with enhanced accuracy
   */
  async searchWithFilters(query) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`🔍 Optimized search for: "${query}"`);
    
    // Parse query for filters and search terms
    const parsedQuery = this.parseAdvancedQuery(query);
    
    // Apply filters from query
    this.applyParsedFilters(parsedQuery);
    
    // Execute intelligent search
    const results = this.executeIntelligentSearch(parsedQuery.searchTerm);
    
    return {
      products: results,
      filters: this.filters,
      query: parsedQuery,
      total: results.length
    };
  }

  /**
   * Advanced query parsing with precise filter extraction
   */
  parseAdvancedQuery(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    const parsed = {
      searchTerm: normalizedQuery,
      extractedFilters: {
        category: null,
        colors: [],
        priceRange: null,
        gender: null,
        onSale: null,
        brands: []
      }
    };

    // Extract category with precise matching
    for (const [category, keywords] of Object.entries(this.categoryMap)) {
      const hasCategoryKeyword = keywords.some(keyword => normalizedQuery.includes(keyword));
      if (hasCategoryKeyword) {
        parsed.extractedFilters.category = category;
        break;
      }
    }

    // Extract colors with enhanced matching
    for (const [color, variations] of Object.entries(this.colorMap)) {
      const hasColor = variations.some(variation => normalizedQuery.includes(variation));
      if (hasColor) {
        parsed.extractedFilters.colors.push(color);
      }
    }

    // Extract price range with comprehensive patterns
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
      const match = normalizedQuery.match(pattern);
      if (match) {
        if (type === 'range') {
          parsed.extractedFilters.priceRange = {
            min: parseInt(match[1]),
            max: parseInt(match[2])
          };
        } else if (type === 'around') {
          const price = parseInt(match[1]);
          parsed.extractedFilters.priceRange = {
            min: price - 50,
            max: price + 50
          };
        } else {
          parsed.extractedFilters.priceRange = {
            type,
            value: parseInt(match[1])
          };
        }
        break;
      }
    }

    // Extract gender with precise detection
    const hasWomen = /\b(women|woman|ladies|womens)\b/i.test(normalizedQuery);
    const hasMen = /\b(mens?|man)\b/i.test(normalizedQuery) && !hasWomen;
    
    if (hasWomen) {
      parsed.extractedFilters.gender = 'W';
    } else if (hasMen) {
      parsed.extractedFilters.gender = 'M';
    }

    // Extract sale status
    if (normalizedQuery.includes('sale') || normalizedQuery.includes('discount') || normalizedQuery.includes('reduced')) {
      parsed.extractedFilters.onSale = true;
    }

    // Clean search term
    let cleanSearchTerm = normalizedQuery;
    
    // Remove extracted filters from search term
    if (parsed.extractedFilters.category) {
      const categoryKeywords = this.categoryMap[parsed.extractedFilters.category] || [];
      categoryKeywords.forEach(keyword => {
        cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), '');
      });
    }
    
    parsed.extractedFilters.colors.forEach(color => {
      const colorVariations = this.colorMap[color] || [color];
      colorVariations.forEach(variation => {
        cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${variation}\\b`, 'gi'), '');
      });
    });
    
    pricePatterns.forEach(({ pattern }) => {
      cleanSearchTerm = cleanSearchTerm.replace(pattern, '');
    });
    
    cleanSearchTerm = cleanSearchTerm.replace(/\b(women|woman|ladies|womens|mens?|man)\b/gi, '');
    
    parsed.searchTerm = cleanSearchTerm.replace(/\s+/g, ' ').trim();

    return parsed;
  }

  /**
   * Apply parsed filters to current filter state
   */
  applyParsedFilters(parsedQuery) {
    const { extractedFilters } = parsedQuery;
    
    if (extractedFilters.category) {
      this.filters.category = extractedFilters.category;
    }
    
    if (extractedFilters.colors.length > 0) {
      this.filters.colors = extractedFilters.colors;
    }
    
    if (extractedFilters.priceRange) {
      this.filters.priceRange = extractedFilters.priceRange;
    }
    
    if (extractedFilters.gender) {
      this.filters.gender = extractedFilters.gender;
    }
    
    if (extractedFilters.onSale !== null) {
      this.filters.onSale = extractedFilters.onSale;
    }
  }

  /**
   * Execute intelligent search with multiple strategies
   */
  executeIntelligentSearch(searchTerm) {
    let results = [];
    
    if (!searchTerm || searchTerm.trim() === '') {
      // No search term, return filtered products
      results = this.products.slice();
    } else {
      // Enhanced search with multiple strategies
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      
      // Strategy 1: Exact matches (highest priority)
      const exactMatches = this.products.filter(product => {
        const searchableText = [
          product.title || '',
          product.name || '',
          product.category || '',
          ...(product.colors || []),
          ...(product.search_keywords || [])
        ].join(' ').toLowerCase();
        
        return searchWords.every(word => searchableText.includes(word));
      });
      
      // Strategy 2: Partial matches (medium priority)
      const partialMatches = this.products.filter(product => {
        const searchableText = [
          product.title || '',
          product.name || '',
          product.category || '',
          ...(product.colors || []),
          ...(product.search_keywords || [])
        ].join(' ').toLowerCase();
        
        return searchWords.some(word => searchableText.includes(word));
      });
      
      // Strategy 3: Fuzzy matches (lower priority)
      const fuzzyMatches = this.products.filter(product => {
        const searchableText = [
          product.title || '',
          product.name || '',
          product.category || '',
          ...(product.colors || []),
          ...(product.search_keywords || [])
        ].join(' ').toLowerCase();
        
        return searchWords.some(word => {
          return searchableText.split(' ').some(productWord => 
            productWord.includes(word) || word.includes(productWord)
          );
        });
      });
      
      // Combine results with priority ordering
      const allMatches = new Map();
      
      exactMatches.forEach(product => allMatches.set(product.id, { product, score: 3 }));
      partialMatches.forEach(product => {
        if (!allMatches.has(product.id)) {
          allMatches.set(product.id, { product, score: 2 });
        }
      });
      fuzzyMatches.forEach(product => {
        if (!allMatches.has(product.id)) {
          allMatches.set(product.id, { product, score: 1 });
        }
      });
      
      results = Array.from(allMatches.values())
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }
    
    // Apply filters
    results = this.applyAdvancedFilters(results);
    
    // Enhanced sorting
    results = this.sortByRelevance(results, searchTerm);
    
    return results;
  }

  /**
   * Apply advanced filters with intelligent fallbacks
   */
  applyAdvancedFilters(products) {
    let filtered = products;
    
    // Category filter
    if (this.filters.category) {
      const categoryFiltered = filtered.filter(product => product.category === this.filters.category);
      if (categoryFiltered.length > 0) {
        filtered = categoryFiltered;
      }
    }
    
    // Color filter with enhanced matching
    if (this.filters.colors.length > 0) {
      const colorFiltered = filtered.filter(product => {
        if (!product.colors || product.colors.length === 0) return true;
        
        return this.filters.colors.some(filterColor => {
          const colorVariations = this.colorMap[filterColor] || [filterColor];
          return product.colors.some(productColor => {
            const productColorLower = productColor.toLowerCase();
            return colorVariations.some(variation => 
              productColorLower.includes(variation.toLowerCase())
            );
          });
        });
      });
      
      if (colorFiltered.length > 0) {
        filtered = colorFiltered;
      }
    }
    
    // Price range filter
    if (this.filters.priceRange) {
      filtered = filtered.filter(product => {
        if (!product.price) return true;
        
        const { priceRange } = this.filters;
        
        if (priceRange.type === 'under') {
          return product.price < priceRange.value;
        } else if (priceRange.type === 'over') {
          return product.price > priceRange.value;
        } else if (priceRange.min !== undefined && priceRange.max !== undefined) {
          return product.price >= priceRange.min && product.price <= priceRange.max;
        }
        
        return true;
      });
    }
    
    // Gender filter with intelligent fallbacks
    if (this.filters.gender) {
      const genderFiltered = filtered.filter(product => {
        if (product.gender === this.filters.gender) return true;
        if (product.gender === 'U') return true; // Always include unisex
        
        // Category-based gender matching
        if (this.filters.gender === 'M' && product.category.includes('mens')) return true;
        if (this.filters.gender === 'W' && product.category.includes('womens')) return true;
        
        return false;
      });
      
      if (genderFiltered.length >= 5) {
        filtered = genderFiltered;
      }
    }
    
    // Sale filter
    if (this.filters.onSale === true) {
      filtered = filtered.filter(product => product.onSale === true);
    }
    
    // In stock filter
    if (this.filters.inStock !== null) {
      filtered = filtered.filter(product => product.in_stock === this.filters.inStock);
    }
    
    return filtered;
  }

  /**
   * Sort results by relevance
   */
  sortByRelevance(products, searchTerm) {
    const searchWords = searchTerm ? searchTerm.toLowerCase().split(' ').filter(word => word.length > 0) : [];
    
    return products.sort((a, b) => {
      // Priority 1: Exact title matches
      const aExactTitle = searchWords.every(word => a.title.toLowerCase().includes(word));
      const bExactTitle = searchWords.every(word => b.title.toLowerCase().includes(word));
      if (aExactTitle && !bExactTitle) return -1;
      if (!aExactTitle && bExactTitle) return 1;
      
      // Priority 2: Products with more words in title
      const aWordsInTitle = searchWords.filter(word => a.title.toLowerCase().includes(word)).length;
      const bWordsInTitle = searchWords.filter(word => b.title.toLowerCase().includes(word)).length;
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

  /**
   * Generate intelligent search response
   */
  generateSearchResponse(searchResult) {
    const { products, filters, total } = searchResult;
    
    if (products.length === 0) {
      return this.generateNoResultsResponse(filters);
    }
    
    let response = `I found ${total} product${total === 1 ? '' : 's'} matching your search:\n\n`;
    
    // Add filter summary if filters are active
    const filterSummary = this.getFilterSummary();
    if (filterSummary.length > 0) {
      response += `**Applied Filters:**\n${filterSummary.join('\n')}\n\n`;
    }
    
    // Show products with accurate pricing
    const displayProducts = products.slice(0, 20); // Limit to 20 for readability
    displayProducts.forEach(product => {
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
    
    if (total > 20) {
      response += `\n*Showing 20 of ${total} products. Refine your search for more specific results.*`;
    }
    
    return response;
  }

  /**
   * Generate no results response with suggestions
   */
  generateNoResultsResponse(filters) {
    let response = "I couldn't find any products matching your exact criteria. ";
    
    const suggestions = [];
    
    if (filters.category) {
      suggestions.push(`Try browsing all ${filters.category.replace('_', ' ')}`);
    }
    
    if (filters.colors.length > 0) {
      suggestions.push(`Try searching without specific colors`);
    }
    
    if (filters.priceRange) {
      suggestions.push(`Try expanding your price range`);
    }
    
    if (suggestions.length > 0) {
      response += `Here are some suggestions:\n\n${suggestions.map(s => `• ${s}`).join('\n')}`;
    } else {
      response += `You might want to try:\n\n• "black handbags"\n• "leather jackets under $500"\n• "crossbody bags"`;
    }
    
    return response;
  }

  /**
   * Get current filter summary
   */
  getFilterSummary() {
    const summary = [];
    
    if (this.filters.category) {
      summary.push(`• Category: ${this.filters.category.replace('_', ' ')}`);
    }
    
    if (this.filters.colors.length > 0) {
      summary.push(`• Colors: ${this.filters.colors.join(', ')}`);
    }
    
    if (this.filters.gender) {
      summary.push(`• Gender: ${this.filters.gender === 'M' ? 'Men' : this.filters.gender === 'W' ? 'Women' : 'Unisex'}`);
    }
    
    if (this.filters.priceRange) {
      const { priceRange } = this.filters;
      if (priceRange.type === 'under') {
        summary.push(`• Price: Under $${priceRange.value}`);
      } else if (priceRange.type === 'over') {
        summary.push(`• Price: Over $${priceRange.value}`);
      } else if (priceRange.min !== undefined && priceRange.max !== undefined) {
        summary.push(`• Price: $${priceRange.min} - $${priceRange.max}`);
      }
    }
    
    if (this.filters.onSale === true) {
      summary.push(`• On Sale: Yes`);
    }
    
    return summary;
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filters = {
      category: null,
      colors: [],
      priceRange: null,
      gender: null,
      inStock: null,
      onSale: null
    };
  }

  /**
   * Get product statistics
   */
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
}

export default OptimizedProductSearchService; 