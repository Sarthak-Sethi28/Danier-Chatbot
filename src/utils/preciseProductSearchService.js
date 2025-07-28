class PreciseProductSearchService {
  constructor() {
    this.products = [];
    this.searchIndex = null;
    this.filters = {
      category: null,
      colors: [],
      priceRange: null,
      gender: null,
      inStock: null
    };
    this.initialized = false;
  }

  /**
   * Initialize the service with precise product data
   */
  async initialize() {
    try {
      // Load precise products
      const preciseProductsModule = await import('../data/precise-products.js');
      this.products = preciseProductsModule.products || [];
      
      // Load search index
      const searchIndexModule = await import('../data/search-index.js');
      this.searchIndex = searchIndexModule.default || {};
      
      this.initialized = true;
      console.log(`🎯 Precise Search Service initialized with ${this.products.length} products`);
    } catch (error) {
      console.error('Error initializing Precise Search Service:', error);
      // Fallback to empty arrays
      this.products = [];
      this.searchIndex = {};
      this.initialized = false;
    }
  }

  /**
   * Main search method with enhanced precision
   */
  async searchWithFilters(query) {
    if (!this.initialized) {
      await this.initialize();
    }

    // Parse query for filters
    const parsedQuery = this.parseQuery(query);
    
    // Apply filters from query
    this.applyParsedFilters(parsedQuery);
    
    // Get search results
    const results = this.executeSearch(parsedQuery.searchTerm);
    
    return {
      products: results,
      filters: this.filters,
      query: parsedQuery,
      total: results.length
    };
  }

  /**
   * Parse query to extract search terms and filters
   */
  parseQuery(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    const parsed = {
      searchTerm: normalizedQuery,
      extractedFilters: {
        category: null,
        colors: [],
        priceRange: null,
        gender: null
      }
    };

    // Extract category
    const categoryPatterns = {
      'handbags': ['handbag', 'bag', 'purse', 'tote', 'satchel', 'clutch'],
      'jackets': ['jacket', 'coat', 'outerwear', 'blazer', 'leather jacket'],
      'accessories': ['accessory', 'accessories', 'leather goods', 'wallet', 'gloves']
    };

    for (const [category, keywords] of Object.entries(categoryPatterns)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        parsed.extractedFilters.category = category;
        break;
      }
    }

    // Extract colors
    const colorPatterns = [
      'black', 'brown', 'white', 'red', 'blue', 'green', 'gray', 'grey',
      'navy', 'tan', 'cream', 'beige', 'burgundy', 'camel', 'cognac'
    ];

    for (const color of colorPatterns) {
      if (normalizedQuery.includes(color)) {
        parsed.extractedFilters.colors.push(color);
      }
    }

    // Extract price range
    const pricePatterns = [
      { pattern: /under \$?(\d+)/i, type: 'under' },
      { pattern: /below \$?(\d+)/i, type: 'under' },
      { pattern: /less than \$?(\d+)/i, type: 'under' },
      { pattern: /over \$?(\d+)/i, type: 'over' },
      { pattern: /above \$?(\d+)/i, type: 'over' },
      { pattern: /more than \$?(\d+)/i, type: 'over' },
      { pattern: /\$?(\d+)-\$?(\d+)/i, type: 'range' }
    ];

    for (const { pattern, type } of pricePatterns) {
      const match = normalizedQuery.match(pattern);
      if (match) {
        if (type === 'range') {
          parsed.extractedFilters.priceRange = {
            min: parseInt(match[1]),
            max: parseInt(match[2])
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

    // Extract gender
    if (normalizedQuery.includes('women') || normalizedQuery.includes('woman')) {
      parsed.extractedFilters.gender = 'women';
    } else if (normalizedQuery.includes('men') || normalizedQuery.includes('man')) {
      parsed.extractedFilters.gender = 'men';
    }

    // Clean search term (remove extracted filters)
    let cleanSearchTerm = normalizedQuery;
    
    // Remove category keywords
    if (parsed.extractedFilters.category) {
      const categoryKeywords = categoryPatterns[parsed.extractedFilters.category];
      categoryKeywords.forEach(keyword => {
        cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), '');
      });
    }
    
    // Remove color keywords
    parsed.extractedFilters.colors.forEach(color => {
      cleanSearchTerm = cleanSearchTerm.replace(new RegExp(`\\b${color}\\b`, 'gi'), '');
    });
    
    // Remove price patterns
    pricePatterns.forEach(({ pattern }) => {
      cleanSearchTerm = cleanSearchTerm.replace(pattern, '');
    });
    
    // Remove gender keywords
    cleanSearchTerm = cleanSearchTerm.replace(/\b(women|woman|men|man)\b/gi, '');
    
    // Clean up extra spaces
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
  }

  /**
   * Execute search with multiple strategies
   */
  executeSearch(searchTerm) {
    let results = [];
    
    if (!searchTerm || searchTerm.trim() === '') {
      // No search term, return all products matching filters
      results = this.products.slice();
    } else {
      // Multi-strategy search
      const strategies = [
        this.exactNameSearch(searchTerm),
        this.keywordSearch(searchTerm),
        this.fuzzySearch(searchTerm),
        this.partialNameSearch(searchTerm)
      ];
      
      // Combine results with scoring
      const scoredResults = new Map();
      
      strategies.forEach((strategyResults, strategyIndex) => {
        const strategyWeight = [1.0, 0.8, 0.6, 0.4][strategyIndex];
        
        strategyResults.forEach(product => {
          const existingScore = scoredResults.get(product.id) || 0;
          scoredResults.set(product.id, existingScore + strategyWeight);
        });
      });
      
      // Get products sorted by score
      const sortedProductIds = Array.from(scoredResults.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      results = sortedProductIds.map(id => 
        this.products.find(p => p.id === id)
      ).filter(Boolean);
    }
    
    // Apply filters
    results = this.applyFilters(results);
    
    // Sort by relevance and price
    results = this.sortResults(results);
    
    return results;
  }

  /**
   * Exact name search
   */
  exactNameSearch(searchTerm) {
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Keyword-based search using search index
   */
  keywordSearch(searchTerm) {
    if (!this.searchIndex.byKeywords) return [];
    
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);
    const matchingProductIds = new Set();
    
    searchWords.forEach(word => {
      Object.keys(this.searchIndex.byKeywords).forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          this.searchIndex.byKeywords[keyword].forEach(productId => {
            matchingProductIds.add(productId);
          });
        }
      });
    });
    
    return Array.from(matchingProductIds).map(id => 
      this.products.find(p => p.id === id)
    ).filter(Boolean);
  }

  /**
   * Fuzzy search for partial matches
   */
  fuzzySearch(searchTerm) {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);
    
    return this.products.filter(product => {
      const productText = `${product.name} ${product.search_keywords.join(' ')}`.toLowerCase();
      
      return searchWords.some(word => {
        // Check if any word in the product text contains the search word
        return productText.split(' ').some(productWord => 
          productWord.includes(word) || word.includes(productWord)
        );
      });
    });
  }

  /**
   * Partial name search
   */
  partialNameSearch(searchTerm) {
    return this.products.filter(product => {
      const nameWords = product.name.toLowerCase().split(' ');
      const searchWords = searchTerm.toLowerCase().split(' ');
      
      return searchWords.every(searchWord => 
        nameWords.some(nameWord => 
          nameWord.includes(searchWord) || searchWord.includes(nameWord)
        )
      );
    });
  }

  /**
   * Apply filters to results
   */
  applyFilters(products) {
    let filtered = products;
    
    // Category filter
    if (this.filters.category) {
      filtered = filtered.filter(product => product.category === this.filters.category);
    }
    
    // Color filter
    if (this.filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        this.filters.colors.some(filterColor => 
          product.colors.some(productColor => 
            productColor.toLowerCase().includes(filterColor.toLowerCase())
          )
        )
      );
    }
    
    // Price range filter
    if (this.filters.priceRange) {
      filtered = filtered.filter(product => {
        if (!product.price) return false;
        
        const { priceRange } = this.filters;
        
        if (priceRange.type === 'under') {
          return product.price < priceRange.value;
        } else if (priceRange.type === 'over') {
          return product.price > priceRange.value;
        } else if (priceRange.min && priceRange.max) {
          return product.price >= priceRange.min && product.price <= priceRange.max;
        }
        
        return true;
      });
    }
    
    // In stock filter
    if (this.filters.inStock !== null) {
      filtered = filtered.filter(product => product.in_stock === this.filters.inStock);
    }
    
    return filtered;
  }

  /**
   * Sort results by relevance and price
   */
  sortResults(products) {
    return products.sort((a, b) => {
      // First, prioritize products with prices
      if (a.price && !b.price) return -1;
      if (!a.price && b.price) return 1;
      
      // Then, prioritize products on sale
      if (a.onSale && !b.onSale) return -1;
      if (!a.onSale && b.onSale) return 1;
      
      // Finally, sort by price (ascending)
      if (a.price && b.price) {
        return a.price - b.price;
      }
      
      // Fallback to alphabetical
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Generate search response text
   */
  generateSearchResponse(searchResult) {
    const { products, filters, total } = searchResult;
    
    if (products.length === 0) {
      return this.generateNoResultsResponse(filters);
    }
    
    // Generate response based on filters and results
    let response = `I found ${total} product${total === 1 ? '' : 's'} matching your criteria:\n\n`;
    
    // Add filter summary
    const filterSummary = this.getFilterSummary();
    if (filterSummary.length > 0) {
      response += `**Search Filters:**\n${filterSummary.join('\n')}\n\n`;
    }
    
    // Add products (limit to first 10 for display)
    const displayProducts = products.slice(0, 10);
    displayProducts.forEach(product => {
      response += `• **${product.name}** - `;
      
      if (product.onSale && product.originalPrice) {
        response += `$${product.price.toFixed(2)} (was $${product.originalPrice.toFixed(2)}) `;
      } else if (product.price) {
        response += `$${product.price.toFixed(2)} `;
      }
      
      if (product.colors.length > 0) {
        response += `- ${product.colors.join(', ')} `;
      }
      
      response += `[View](${product.url})\n`;
    });
    
    if (products.length > 10) {
      response += `\n*...and ${products.length - 10} more products*`;
    }
    
    return response;
  }

  /**
   * Generate no results response
   */
  generateNoResultsResponse(filters) {
    let response = "I couldn't find any products matching your exact criteria. ";
    
    // Suggest alternatives
    const suggestions = [];
    
    if (filters.category) {
      suggestions.push(`Try browsing all ${filters.category}`);
    }
    
    if (filters.colors.length > 0) {
      suggestions.push(`Try searching without color restrictions`);
    }
    
    if (filters.priceRange) {
      suggestions.push(`Try expanding your price range`);
    }
    
    if (suggestions.length > 0) {
      response += `Here are some suggestions:\n\n${suggestions.map(s => `• ${s}`).join('\n')}`;
    }
    
    return response;
  }

  /**
   * Get current filter summary
   */
  getFilterSummary() {
    const summary = [];
    
    if (this.filters.category) {
      summary.push(`• Category: ${this.filters.category}`);
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
      } else if (priceRange.min && priceRange.max) {
        summary.push(`• Price: $${priceRange.min} - $${priceRange.max}`);
      }
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
      inStock: null
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
      /in (black|brown|white|red|blue|green|gray|grey|navy|tan|cream)/i,
      /under \$\d+/i,
      /over \$\d+/i,
      /between \$\d+ and \$\d+/i
    ];
    
    return refinementPatterns.some(pattern => pattern.test(query));
  }
}

export default PreciseProductSearchService; 