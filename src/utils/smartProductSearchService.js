class SmartProductSearchService {
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
  }

  /**
   * Map product type to category using exact Danier type codes
   */
  mapCategory(type) {
    // Use exact product type codes for precise categorization
    switch (type) {
      // Men's Jackets/Outerwear
      case 'MOWJA': // Men's Outerwear Jacket
      case 'MOWBO': // Men's Outerwear Bomber  
      case 'MOWCO': // Men's Outerwear Coat
      case 'MFWBL': // Men's Blazer
      case 'MFWKN': // Men's Knitwear
      case 'MFWVE': // Men's Vest
        return 'mens_jackets';
        
      // Women's Jackets/Outerwear  
      case 'WOWJA': // Women's Outerwear Jacket
      case 'WOWBO': // Women's Outerwear Bomber
      case 'WOWCO': // Women's Outerwear Coat
      case 'WOWTO': // Women's Outerwear Topper
      case 'WFWBL': // Women's Blazer
      case 'WFWKN': // Women's Knitwear
      case 'WFWVE': // Women's Vest
      case 'WFWSK': // Women's Skirts
      case 'WFWTO': // Women's Tops
      case 'WFWPA': // Women's Pants
      case 'WFWDR': // Women's Dresses
      case 'WFWDE': // Women's Denim
      case 'WFWSF': // Women's Fashion
        return 'womens_jackets';
        
      // Women's Handbags
      case 'WACHB': // Women's Accessories Handbag (464 products!)
        return 'womens_handbags';
        
      // Women's Wallets/Accessories
      case 'WACWA': // Women's Accessories Wallet (250 products)
      case 'WACGL': // Women's Accessories Gloves
      case 'WACHA': // Women's Accessories Hat
      case 'WACBE': // Women's Accessories Belt
      case 'WACSC': // Women's Accessories Scarf
      case 'WACSH': // Women's Accessories Shoes
        return 'womens_accessories';
        
      // Men's Wallets/Accessories
      case 'MACWA': // Men's Accessories Wallet (83 products)
      case 'MACMB': // Men's Accessories Messenger Bag (68 products)
      case 'MACGL': // Men's Accessories Gloves
      case 'MACHA': // Men's Accessories Hat
      case 'MACBE': // Men's Accessories Belt
      case 'MACBA': // Men's Accessories Bag
      case 'MACSH': // Men's Accessories Shoes
        return 'mens_accessories';
        
      // Travel/Luggage (Unisex)
      case 'UTRHL': // Unisex Travel Hard Luggage (30 products)
      case 'WTRTB': // Women's Travel Bag
      case 'WTRJC': // Women's Travel Jacket
      case 'WTRCC': // Women's Travel Case
      case 'UTRTB': // Unisex Travel Bag
      case 'MTRWC': // Men's Travel Weekend Case
      case 'MTRTB': // Men's Travel Bag
        return 'travel_luggage';
        
      // Care Products & Special
      case 'CARE PRODUCT':
      case 'ALL SEASON':
      case 'UACWH': // Unisex Accessories
      case 'UCPWI': // Unisex Care Product
        return 'care_products';
        
      default:
        // Fallback to text-based detection
        const lowerType = type.toLowerCase();
        if (lowerType.includes('jacket') || lowerType.includes('blazer') || lowerType.includes('coat')) {
          return 'jackets';
        } else if (lowerType.includes('bag') || lowerType.includes('handbag') || lowerType.includes('tote') || lowerType.includes('satchel')) {
          return 'handbags';
        } else if (lowerType.includes('wallet') || lowerType.includes('cardholder')) {
          return 'wallets';
        } else {
          return 'accessories';
        }
    }
  }

  /**
   * Extract gender from product data using Danier's systematic type codes
   */
  extractGender(product) {
    // Use the product type code - this is the most reliable method
    if (product.type) {
      const typeCode = product.type.toUpperCase();
      
      // Systematic gender detection based on first letter
      if (typeCode.startsWith('M')) return 'M';  // Men's products
      if (typeCode.startsWith('W')) return 'W';  // Women's products
      if (typeCode.startsWith('U')) return 'U';  // Unisex products
    }
    
    // Fallback: Check gender field
    if (product.gender) {
      const gender = product.gender.toLowerCase();
      if (gender.includes('women') || gender.includes('female')) return 'W';
      if (gender.includes('men') || gender.includes('male')) return 'M';
    }
    
    // Fallback: Check tags
    if (product.originalTags) {
      const tags = product.originalTags.toLowerCase();
      if (tags.includes('women')) return 'W';
      if (tags.includes('men')) return 'M';
    }
    
    // Fallback: Check title for gender indicators
    if (product.title) {
      const title = product.title.toLowerCase();
      if (title.includes('women') || title.includes("women's")) return 'W';
      if (title.includes('men') || title.includes("men's")) return 'M';
    }
    
    // Default to Unisex if unclear
    return 'U';
  }

  /**
   * Initialize the service with smart product data
   */
  async initialize() {
    try {
      // Fetch complete products data from public folder
      const productsResponse = await fetch('/complete-smart-products.json');
      const productsData = await productsResponse.json();
      
      // Transform to dropdown-compatible format
      this.products = (productsData.products || []).map((product) => ({
        id: product.id,
        name: product.name,
        title: product.name, // For dropdown display
        category: product.category,
        price: product.price,
        salePrice: product.price,
        originalPrice: product.onSale ? product.originalPrice : null,
        colors: product.colors || [],
        description: product.description || '',
        url: product.url,
        imageUrl: product.image_url,
        onSale: product.onSale,
        isOnSale: product.onSale,
        in_stock: product.in_stock,
        gender: this.extractGender(product), // Extract gender from tags and fields
        search_keywords: product.search_keywords || []
      }));
      
      // Fetch search index from public folder
      const searchIndexResponse = await fetch('/complete-smart-search-index.json');
      this.searchIndex = await searchIndexResponse.json();
      
      this.initialized = true;
      console.log(`🧠 Smart Search Service initialized with ${this.products.length} products`);
    } catch (error) {
      console.error('Error initializing Smart Search Service:', error);
      console.log('🔄 Trying fallback data import...');
      
             // Fallback: try importing directly from danierProducts
       try {
         const { DANIER_PRODUCTS } = await import('../data/danierProducts');
         // Transform to expected format
         this.products = DANIER_PRODUCTS.map(product => ({
           id: product.id,
           name: product.name,
           title: product.name, // For dropdown display
           category: product.category,
           price: product.price,
           salePrice: product.onSale ? product.price : product.price, // Always show current price as salePrice
           originalPrice: product.onSale ? product.originalPrice : null, // Only show original if on sale
           colors: product.colors,
           description: product.description,
           url: product.url,
           imageUrl: product.image ? `https://cdn.shopify.com/s/files/1/0041/4458/1/products/${product.image}` : null,
           onSale: product.onSale,
           isOnSale: product.onSale,
           in_stock: true,
           search_keywords: [
             product.name.toLowerCase().split(' '),
             product.category.toLowerCase(),
             ...product.colors.map(c => c.toLowerCase()),
             product.description.toLowerCase().split(' ')
           ].flat()
         }));
         this.searchIndex = { byKeywords: {} };
         this.initialized = true;
         console.log(`🧠 Fallback: Smart Search Service initialized with ${this.products.length} products from danierProducts`);
       } catch (fallbackError) {
         console.error('Fallback also failed:', fallbackError);
         this.products = [];
         this.searchIndex = {};
         this.initialized = false;
       }
    }
  }

  /**
   * Main search method with enhanced intelligence
   */
  async searchWithFilters(query) {
    if (!this.initialized) {
      await this.initialize();
    }

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
   * Advanced query parsing with better filter extraction
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

    // Extract category with complete Danier product patterns
    const categoryPatterns = {
      'mens_jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'vest', 'knitwear'],
      'womens_jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'vest', 'knitwear', 'dress', 'skirt', 'pants', 'top'],
      'jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'bomber', 'moto', 'reversible'],
      'womens_handbags': ['handbag', 'bag', 'purse', 'tote', 'satchel', 'crossbody', 'shoulder', 'bucket', 'clutch'],
      'handbags': ['handbag', 'bag', 'purse', 'tote', 'satchel', 'crossbody', 'shoulder', 'bucket', 'clutch'],
      'womens_accessories': ['wallet', 'cardholder', 'gloves', 'belt', 'scarf', 'hat', 'accessories'],
      'mens_accessories': ['wallet', 'cardholder', 'messenger', 'briefcase', 'gloves', 'belt', 'hat', 'accessories'],
      'wallets': ['wallet', 'bifold', 'cardholder', 'card holder'],
      'travel_luggage': ['travel', 'luggage', 'suitcase', 'duffel', 'weekender', 'travel bag'],
      'care_products': ['care', 'cleaner', 'conditioner', 'polish', 'maintenance'],
      'gloves': ['gloves', 'mittens'],
      'accessories': ['belt', 'accessory', 'care kit', 'scarf', 'hat'],
      'shoes': ['shoe', 'boot', 'sneaker', 'loafer']
    };

    // FIXED: More precise gender detection to prevent "women" matching "men"
    const hasWomen = /\b(women|woman|ladies|womens)\b/i.test(normalizedQuery);
    const hasMen = /\b(mens?|man)\b/i.test(normalizedQuery) && !hasWomen; // Only match men if not women
    const hasJacket = categoryPatterns.jackets.some(keyword => normalizedQuery.includes(keyword));
    const hasBag = categoryPatterns.handbags.some(keyword => normalizedQuery.includes(keyword));
    const hasWallet = categoryPatterns.wallets.some(keyword => normalizedQuery.includes(keyword));
    const hasAccessories = categoryPatterns.accessories.some(keyword => normalizedQuery.includes(keyword));
    
    // FIXED: Much more lenient category detection - only set category for very specific searches
    // This prevents over-filtering that results in too few products
    if (hasJacket && hasMen && normalizedQuery.includes('jacket') && normalizedQuery.includes('men')) {
      parsed.extractedFilters.category = 'mens_jackets';
    } else if (hasJacket && hasWomen && normalizedQuery.includes('jacket') && normalizedQuery.includes('women')) {
      parsed.extractedFilters.category = 'womens_jackets';
    } else if (hasWallet && hasMen && normalizedQuery.includes('wallet') && normalizedQuery.includes('men')) {
      parsed.extractedFilters.category = 'mens_accessories';
    } else if (hasWallet && hasWomen && normalizedQuery.includes('wallet') && normalizedQuery.includes('women')) {
      parsed.extractedFilters.category = 'womens_accessories';
    } else {
      // Don't set category filter for general searches like "red handbags"
      // This allows more products to show up in search results
      // Only set category for very specific searches like "women's leather jackets"
    }

    // Extract colors with better matching - more inclusive for red variations
    const colorPatterns = [
      'black', 'brown', 'white', 'red', 'blue', 'green', 'gray', 'grey',
      'navy', 'tan', 'cream', 'beige', 'burgundy', 'camel', 'cognac', 'saddle',
      'dark brown', 'multi', 'deep red', 'dark red', 'burgundy', 'crimson', 'maroon'
    ];

    for (const color of colorPatterns) {
      if (normalizedQuery.includes(color)) {
        parsed.extractedFilters.colors.push(color);
      }
    }

    // Extract price range with more patterns
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

    // FIXED: Extract gender using precise regex patterns
    if (hasWomen) {
      parsed.extractedFilters.gender = 'W';
    } else if (hasMen) {
      parsed.extractedFilters.gender = 'M';
    }

    // Extract sale status
    if (normalizedQuery.includes('sale') || normalizedQuery.includes('discount') || normalizedQuery.includes('reduced')) {
      parsed.extractedFilters.onSale = true;
    }

    // Extract brand names
    const brandPatterns = ['monaco', 'colette', 'rhea', 'arleth', 'jovie', 'mariam', 'edith', 'willowby', 'aria', 'nova', 'eliam', 'charly', 'gilles'];
    for (const brand of brandPatterns) {
      if (normalizedQuery.includes(brand)) {
        parsed.extractedFilters.brands.push(brand);
      }
    }

    // Clean search term
    let cleanSearchTerm = normalizedQuery;
    
    // Remove extracted filters from search term
    if (parsed.extractedFilters.category) {
      const categoryKeywords = categoryPatterns[parsed.extractedFilters.category];
      categoryKeywords.forEach(keyword => {
        cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), '');
      });
    }
    
    parsed.extractedFilters.colors.forEach(color => {
      cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${color}\\b`, 'gi'), '');
    });
    
    pricePatterns.forEach(({ pattern }) => {
      cleanSearchTerm = cleanSearchTerm.replace(pattern, '');
    });
    
    // FIXED: Use regex for removing gender terms
    cleanSearchTerm = cleanSearchTerm.replace(/\b(women|woman|ladies|womens|mens?|man)\b/gi, '');
    
    parsed.extractedFilters.brands.forEach(brand => {
      cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${brand}\\b`, 'gi'), '');
    });
   
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
      // FIXED: More inclusive search to show ALL relevant products
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      
      // Strategy 1: Simple inclusive search - show ALL products that match ANY search word
      results = this.products.filter(product => {
        const searchableText = [
          product.title || '',
          product.name || '',
          product.category || '',
          product.type || '',
          ...(product.colors || []),
          ...(product.search_keywords || []),
          ...(product.originalTags ? product.originalTags.toLowerCase().split(', ') : [])
        ].join(' ').toLowerCase();
        
        // Show product if ANY search word matches (OR logic for maximum results)
        return searchWords.some(word => searchableText.includes(word));
      });
      
      // If we get too many results, be slightly more specific but still inclusive
      if (results.length > 500) {
        results = this.products.filter(product => {
          const title = product.title.toLowerCase();
          const tags = (product.originalTags || '').toLowerCase();
          const primaryText = `${title} ${tags}`;
          
          // Require at least 50% of words to match in primary fields
          const wordsInPrimary = searchWords.filter(word => primaryText.includes(word));
          return wordsInPrimary.length >= Math.ceil(searchWords.length * 0.5);
        });
      }
    }
    
    // Apply filters but be more lenient
    results = this.applyAdvancedFilters(results);
    
    // Enhanced sorting for sales relevance
    results = this.sortBySalesRelevance(results, searchTerm);
    
    // Return all results - no artificial limits for sales
    return results;
  }

  /**
   * NEW: Sort results by sales relevance
   */
  sortBySalesRelevance(products, searchTerm) {
    const searchWords = searchTerm ? searchTerm.toLowerCase().split(' ').filter(word => word.length > 0) : [];
    
    return products.sort((a, b) => {
      // Priority 1: Exact title matches
      const aExactTitle = searchWords.every(word => a.title.toLowerCase().includes(word));
      const bExactTitle = searchWords.every(word => b.title.toLowerCase().includes(word));
      if (aExactTitle && !bExactTitle) return -1;
      if (!aExactTitle && bExactTitle) return 1;
      
      // Priority 2: Products with all words in title
      const aWordsInTitle = searchWords.filter(word => a.title.toLowerCase().includes(word)).length;
      const bWordsInTitle = searchWords.filter(word => b.title.toLowerCase().includes(word)).length;
      if (aWordsInTitle !== bWordsInTitle) return bWordsInTitle - aWordsInTitle;
      
      // Priority 3: Favor on-sale items
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
   * Search strategies
   */
  exactNameSearch(searchTerm) {
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  brandSearch(searchTerm) {
    return this.products.filter(product => {
      const brand = product.name.split(' ')[0].toLowerCase();
      return brand.includes(searchTerm.toLowerCase()) || searchTerm.toLowerCase().includes(brand);
    });
  }

  keywordSearch(searchTerm) {
    if (!this.searchIndex.byKeywords) return [];
    
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);
    const matchingProductIds = new Set();
    
    searchWords.forEach(word => {
      Object.keys(this.searchIndex.byKeywords).forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          this.searchIndex.byKeywords[keyword].forEach(productId => {
            matchingProductIds.add(parseInt(productId));
          });
        }
      });
    });
    
    return Array.from(matchingProductIds).map(id => 
      this.products.find(p => p.id === id)
    ).filter(Boolean);
  }

  descriptionSearch(searchTerm) {
    return this.products.filter(product => {
      if (!product.description) return false;
      return product.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  fuzzySearch(searchTerm) {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);
    
    return this.products.filter(product => {
      const productText = `${product.name} ${product.search_keywords.join(' ')}`.toLowerCase();
      
      return searchWords.some(word => {
        return productText.split(' ').some(productWord => 
          productWord.includes(word) || word.includes(productWord)
        );
      });
    });
  }

  /**
   * Apply advanced filters (more lenient approach)
   */
  applyAdvancedFilters(products) {
    let filtered = products;
    
    // Apply category filter more intelligently - be more lenient
    if (this.filters.category) {
      const categoryFiltered = filtered.filter(product => product.category === this.filters.category);
      // Only apply category filter if we get reasonable results, otherwise show all
      if (categoryFiltered.length > 0) {
        filtered = categoryFiltered;
      }
    }
    
    // ENHANCED: Apply color filter more leniently for maximum results
    if (this.filters.colors.length > 0) {
      const colorFiltered = filtered.filter(product => {
        if (!product.colors || product.colors.length === 0) return true; // Include products without color info
        
        return this.filters.colors.some(filterColor => {
          return product.colors.some(productColor => {
            const productColorLower = productColor.toLowerCase();
            const filterColorLower = filterColor.toLowerCase();
            
            // More lenient color matching - especially for red variations
            if (filterColorLower === 'black') {
              return productColorLower.includes('black');
            }
            if (filterColorLower === 'brown') {
              return productColorLower.includes('brown') || productColorLower === 'bourbon';
            }
            if (filterColorLower === 'blue') {
              return productColorLower.includes('blue');
            }
            if (filterColorLower === 'white') {
              return productColorLower.includes('white') || productColorLower.includes('cream') || productColorLower.includes('ecru');
            }
            if (filterColorLower === 'red') {
              // Include all red variations
              return productColorLower.includes('red') || 
                     productColorLower.includes('burgundy') || 
                     productColorLower.includes('crimson') || 
                     productColorLower.includes('maroon') ||
                     productColorLower.includes('deep red') ||
                     productColorLower.includes('dark red');
            }
            
            // Default: partial match
            return productColorLower.includes(filterColorLower);
          });
        });
      });
      
      // Always apply color filter if we have results, otherwise show all
      if (colorFiltered.length > 0) {
        filtered = colorFiltered;
      }
    }
    
    // Price range filter (only if specified)
    if (this.filters.priceRange) {
      filtered = filtered.filter(product => {
        if (!product.price) return true; // Include products without price info
        
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
    
    // FIXED: Much more lenient gender filtering - only filter if we have plenty of results
    if (this.filters.gender) {
      const genderFiltered = filtered.filter(product => {
        // Exact gender match (M, W, or U)
        if (product.gender === this.filters.gender) return true;
        
        // Always include Unisex products in any gender search
        if (product.gender === 'U') return true;
        
        // More inclusive gender matching
        if (this.filters.gender === 'M') {
          return product.gender === 'M' ||
                 product.type?.startsWith('M') ||
                 product.category === 'mens_accessories' ||
                 product.category === 'mens_jackets' ||
                 product.title.toLowerCase().includes('men') ||
                 product.title.toLowerCase().includes('male');
        }
        
        if (this.filters.gender === 'W') {
          return product.gender === 'W' ||
                 product.type?.startsWith('W') ||
                 product.category === 'womens_accessories' ||
                 product.category === 'womens_jackets' ||
                 product.category === 'womens_handbags' ||
                 product.title.toLowerCase().includes('women') ||
                 product.title.toLowerCase().includes('female');
        }
        
        return false;
      });
      
      // FIXED: Only apply gender filter if we get reasonable results, otherwise show all
      // This prevents over-filtering that results in too few products
      if (genderFiltered.length >= 10) {
        filtered = genderFiltered;
      } else {
        // If gender filtering gives too few results, don't apply it
        console.log(`[DEBUG] Gender filter too restrictive (${genderFiltered.length} results), showing all products`);
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
   * Sort results intelligently
   */
  sortIntelligentResults(products) {
    return products.sort((a, b) => {
      // First, prioritize products on sale
      if (a.onSale && !b.onSale) return -1;
      if (!a.onSale && b.onSale) return 1;
      
      // Then, prioritize products with prices
      if (a.price && !b.price) return -1;
      if (!a.price && b.price) return 1;
      
      // Finally, sort by price (ascending)
      if (a.price && b.price) {
        return a.price - b.price;
      }
      
      // Fallback to alphabetical
      return a.name.localeCompare(b.name);
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
    
    // Generate contextual response
    let response = `I found ${total} product${total === 1 ? '' : 's'} matching your search:\n\n`;
    
    // Add filter summary if filters are active
    const filterSummary = this.getFilterSummary();
    if (filterSummary.length > 0) {
      response += `**Applied Filters:**\n${filterSummary.join('\n')}\n\n`;
    }
    
    // Show ALL products - no limits for sales accuracy
    const displayProducts = products;
    displayProducts.forEach(product => {
      response += `• **${product.name}** - `;
      
      // Price display with sale highlighting
      if (product.onSale && product.originalPrice > product.price) {
        response += `~~$${product.originalPrice}~~ **$${product.price}** `;
        const savings = product.originalPrice - product.price;
        response += `*(Save $${savings}!)* `;
      } else if (product.price) {
        response += `$${product.price} `;
      }
      
      // Color display
      if (product.colors.length > 0) {
        response += `- Available in: ${product.colors.join(', ')} `;
      }
      
      // View link
      response += `[View Product](${product.url})\n`;
    });
    
    return response;
  }

  /**
   * Generate no results response with suggestions
   */
  generateNoResultsResponse(filters) {
    let response = "I couldn't find any products matching your exact criteria. ";
    
    // Provide intelligent suggestions
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
      summary.push(`• Gender: ${this.filters.gender}`);
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
   * Check if query is a filter refinement
   */
  isFilterRefinement(query) {
    const refinementPatterns = [
      /show me (only|just)/i,
      /filter by/i,
      /narrow down/i,
      /in (black|brown|white|red|blue|green|gray|grey|navy|tan|cream|saddle|burgundy)/i,
      /under \$\d+/i,
      /over \$\d+/i,
      /between \$\d+ and \$\d+/i,
      /on sale/i,
      /discount/i
    ];
    
    return refinementPatterns.some(pattern => pattern.test(query));
  }

  /**
   * Generate follow-up questions
   */
  generateFollowUpQuestions(filters) {
    const questions = [];
    
    if (!filters.category) {
      questions.push("What type of product are you looking for? (handbags, jackets, wallets, etc.)");
    }
    
    if (!filters.colors.length) {
      questions.push("Do you have a preferred color?");
    }
    
    if (!filters.priceRange) {
      questions.push("What's your budget range?");
    }
    
    if (questions.length > 0) {
      return `To help you find the perfect product:\n\n${questions.map(q => `• ${q}`).join('\n')}`;
    }
    
    return null;
  }
}

export default SmartProductSearchService; 