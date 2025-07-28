// CSV Product Search Service for Danier Chatbot
// Uses the comprehensive product export data for intelligent search

import { readFileSync } from 'fs';
import { join } from 'path';

class CSVProductSearchService {
  constructor() {
    this.products = [];
    this.searchIndex = {};
    this.loadProducts();
    this.buildSearchIndex();
  }

  // Load and parse CSV data
  loadProducts() {
    try {
      // For now, we'll create a comprehensive product database from the CSV structure
      // In production, this would be loaded from a processed JSON file
      this.products = this.createProductDatabase();
      console.log(`Loaded ${this.products.length} products from CSV data`);
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [];
    }
  }

  // Create product database from CSV structure
  createProductDatabase() {
    // This is a comprehensive product database based on your CSV structure
    // In production, you'd process the CSV and save as JSON for faster loading
    return [
      // Women's Leather Jackets
      {
        id: 'monaco-reversible-jacket',
        handle: 'monaco-reversible-jacket',
        title: 'MONACO REVERSIBLE JACKET',
        category: 'Women\'s Leather Jackets',
        type: 'Jacket',
        gender: 'Women',
        description: 'Reversible leather jacket with band collar. Crafted in genuine leather.',
        originalPrice: 577.00,
        salePrice: 577.00,
        colors: ['BLACK'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        url: 'https://danier.com/products/monaco-reversible-jacket',
        imageUrl: 'https://danier.com/cdn/shop/files/monaco-reversible-jacket-black.jpg',
        tags: ['jacket', 'leather', 'reversible', 'band collar', 'women'],
        searchTerms: ['monaco', 'reversible', 'jacket', 'leather', 'band collar', 'women jacket']
      },
      {
        id: 'monaco-blazer',
        handle: 'monaco-blazer',
        title: 'MONACO BLAZER',
        category: 'Women\'s Leather Jackets',
        type: 'Blazer',
        gender: 'Women',
        description: 'Leather blazer with 3-button front closure. Professional and stylish.',
        originalPrice: 577.00,
        salePrice: 577.00,
        colors: ['BLACK'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        url: 'https://danier.com/products/monaco-blazer',
        imageUrl: 'https://danier.com/cdn/shop/files/monaco-blazer-black.jpg',
        tags: ['blazer', 'leather', '3-button', 'professional', 'women'],
        searchTerms: ['monaco', 'blazer', 'leather', 'professional', 'women blazer']
      },

      // Women's Handbags
      {
        id: 'mariam-small-satchel',
        handle: 'mariam-small-satchel',
        title: 'MARIAM SMALL SATCHEL',
        category: 'Women\'s Handbags',
        type: 'Satchel',
        gender: 'Women',
        description: 'Elegant small satchel in premium leather. Perfect for everyday use.',
        originalPrice: 199.00,
        salePrice: 199.00,
        colors: ['BLACK', 'SADDLE', 'WHITE'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/mariam-small-satchel',
        imageUrl: 'https://danier.com/cdn/shop/files/mariam-small-satchel-black.jpg',
        tags: ['satchel', 'handbag', 'small', 'everyday', 'women'],
        searchTerms: ['mariam', 'satchel', 'small', 'handbag', 'women bag']
      },
      {
        id: 'mariam-large-satchel',
        handle: 'mariam-large-satchel',
        title: 'MARIAM LARGE SATCHEL',
        category: 'Women\'s Handbags',
        type: 'Satchel',
        gender: 'Women',
        description: 'Spacious large satchel for work and travel. Premium leather construction.',
        originalPrice: 229.00,
        salePrice: 229.00,
        colors: ['BLACK', 'SADDLE', 'WHITE'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/mariam-large-satchel',
        imageUrl: 'https://danier.com/cdn/shop/files/mariam-large-satchel-black.jpg',
        tags: ['satchel', 'handbag', 'large', 'work', 'travel', 'women'],
        searchTerms: ['mariam', 'satchel', 'large', 'handbag', 'work bag', 'women bag']
      },
      {
        id: 'edith-crossbody',
        handle: 'edith-crossbody',
        title: 'EDITH CROSSBODY',
        category: 'Women\'s Handbags',
        type: 'Crossbody',
        gender: 'Women',
        description: 'Versatile crossbody bag. Perfect for hands-free convenience.',
        originalPrice: 199.00,
        salePrice: 199.00,
        colors: ['BLACK', 'WHITE'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/edith-crossbody',
        imageUrl: 'https://danier.com/cdn/shop/files/edith-crossbody-black.jpg',
        tags: ['crossbody', 'handbag', 'hands-free', 'women'],
        searchTerms: ['edith', 'crossbody', 'handbag', 'hands-free', 'women bag']
      },
      {
        id: 'edith-satchel',
        handle: 'edith-satchel',
        title: 'EDITH SATCHEL',
        category: 'Women\'s Handbags',
        type: 'Satchel',
        gender: 'Women',
        description: 'Classic satchel design in premium leather.',
        originalPrice: 249.00,
        salePrice: 249.00,
        colors: ['BLACK'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/edith-satchel',
        imageUrl: 'https://danier.com/cdn/shop/files/edith-satchel-black.jpg',
        tags: ['satchel', 'handbag', 'classic', 'women'],
        searchTerms: ['edith', 'satchel', 'handbag', 'classic', 'women bag']
      },
      {
        id: 'willowby-camera-bag',
        handle: 'willowby-camera-bag',
        title: 'WILLOWBY CAMERA BAG',
        category: 'Women\'s Handbags',
        type: 'Camera Bag',
        gender: 'Women',
        description: 'Stylish camera bag with protective compartments.',
        originalPrice: 159.00,
        salePrice: 159.00,
        colors: ['BLACK'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/willowby-camera-bag',
        imageUrl: 'https://danier.com/cdn/shop/files/willowby-camera-bag-black.jpg',
        tags: ['camera bag', 'handbag', 'protective', 'women'],
        searchTerms: ['willowby', 'camera bag', 'handbag', 'protective', 'women bag']
      },

      // Men's Laptop Bags
      {
        id: 'eliam-laptop-bag',
        handle: 'eliam-laptop-bag',
        title: 'ELIAM LAPTOP BAG',
        category: 'Men\'s Laptop Bags',
        type: 'Laptop Bag',
        gender: 'Men',
        description: 'Professional laptop carrier for business use.',
        originalPrice: 349.00,
        salePrice: 349.00,
        colors: ['BROWN'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/eliam-laptop-bag',
        imageUrl: 'https://danier.com/cdn/shop/files/eliam-laptop-bag-brown.jpg',
        tags: ['laptop bag', 'professional', 'business', 'men'],
        searchTerms: ['eliam', 'laptop bag', 'professional', 'business', 'men bag']
      },
      {
        id: 'charly-laptop-bag',
        handle: 'charly-laptop-bag',
        title: 'CHARLY LAPTOP BAG',
        category: 'Men\'s Laptop Bags',
        type: 'Laptop Bag',
        gender: 'Men',
        description: 'Business laptop bag in dark brown leather.',
        originalPrice: 199.00,
        salePrice: 199.00,
        colors: ['DARK BROWN'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/charly-laptop-bag',
        imageUrl: 'https://danier.com/cdn/shop/files/charly-laptop-bag-dark-brown.jpg',
        tags: ['laptop bag', 'business', 'dark brown', 'men'],
        searchTerms: ['charly', 'laptop bag', 'business', 'dark brown', 'men bag']
      },
      {
        id: 'gilles-laptop-bag',
        handle: 'gilles-laptop-bag',
        title: 'GILLES LAPTOP BAG',
        category: 'Men\'s Laptop Bags',
        type: 'Laptop Bag',
        gender: 'Men',
        description: 'Premium laptop bag for business use.',
        originalPrice: 299.00,
        salePrice: 299.00,
        colors: ['BLACK', 'BROWN'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/gilles-laptop-bag',
        imageUrl: 'https://danier.com/cdn/shop/files/gilles-laptop-bag-black.jpg',
        tags: ['laptop bag', 'premium', 'business', 'men'],
        searchTerms: ['gilles', 'laptop bag', 'premium', 'business', 'men bag']
      },

      // Women's Accessories
      {
        id: 'aberdeen-cardholder',
        handle: 'aberdeen-cardholder-copy',
        title: 'ABERDEEN CARDHOLDER',
        category: 'Women\'s Accessories',
        type: 'Cardholder',
        gender: 'Women',
        description: 'Pebbled leather card holder. Durable against drops and scratches.',
        originalPrice: 39.00,
        salePrice: 29.00,
        colors: ['BLACK', 'BROWN', 'SADDLE'],
        sizes: ['ONE SIZE'],
        url: 'https://danier.com/products/aberdeen-cardholder',
        imageUrl: 'https://danier.com/cdn/shop/files/aberdeen-cardholder-black.jpg',
        tags: ['cardholder', 'wallet', 'pebbled leather', 'women'],
        searchTerms: ['aberdeen', 'cardholder', 'wallet', 'pebbled leather', 'women accessory']
      }
    ];
  }

  // Build search index for fast lookups
  buildSearchIndex() {
    this.searchIndex = {
      byCategory: {},
      byType: {},
      byColor: {},
      byGender: {},
      byTag: {},
      bySearchTerm: {}
    };

    this.products.forEach(product => {
      // Index by category
      if (!this.searchIndex.byCategory[product.category]) {
        this.searchIndex.byCategory[product.category] = [];
      }
      this.searchIndex.byCategory[product.category].push(product);

      // Index by type
      if (!this.searchIndex.byType[product.type]) {
        this.searchIndex.byType[product.type] = [];
      }
      this.searchIndex.byType[product.type].push(product);

      // Index by color
      product.colors.forEach(color => {
        if (!this.searchIndex.byColor[color]) {
          this.searchIndex.byColor[color] = [];
        }
        this.searchIndex.byColor[color].push(product);
      });

      // Index by gender
      if (!this.searchIndex.byGender[product.gender]) {
        this.searchIndex.byGender[product.gender] = [];
      }
      this.searchIndex.byGender[product.gender].push(product);

      // Index by tags
      product.tags.forEach(tag => {
        if (!this.searchIndex.byTag[tag]) {
          this.searchIndex.byTag[tag] = [];
        }
        this.searchIndex.byTag[tag].push(product);
      });

      // Index by search terms
      product.searchTerms.forEach(term => {
        if (!this.searchIndex.bySearchTerm[term.toLowerCase()]) {
          this.searchIndex.bySearchTerm[term.toLowerCase()] = [];
        }
        this.searchIndex.bySearchTerm[term.toLowerCase()].push(product);
      });
    });
  }

  // Natural language search
  search(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return {
        products: this.products.slice(0, 10),
        total: this.products.length,
        query: query,
        searchType: 'all'
      };
    }

    // Extract search criteria
    const criteria = this.extractSearchCriteria(normalizedQuery);
    
    // Perform search
    let results = this.performSearch(criteria);
    
    // Sort by relevance
    results = this.sortByRelevance(results, criteria);
    
    return {
      products: results,
      total: results.length,
      query: query,
      searchType: criteria.type,
      criteria: criteria
    };
  }

  // Extract search criteria from natural language
  extractSearchCriteria(query) {
    const criteria = {
      keywords: [],
      category: null,
      type: null,
      colors: [],
      gender: null,
      priceRange: { min: null, max: null },
      type: 'natural'
    };

    // Extract colors
    const colorKeywords = ['black', 'brown', 'white', 'saddle', 'red', 'blue', 'green', 'dark brown'];
    colorKeywords.forEach(color => {
      if (query.includes(color)) {
        criteria.colors.push(color.toUpperCase());
      }
    });

    // Extract categories with priority order (specific first)
    const categoryKeywords = [
      { keywords: ['laptop bag', 'laptop bags'], category: 'Men\'s Laptop Bags', type: 'laptop bag' },
      { keywords: ['handbag', 'handbags', 'purse', 'tote', 'satchel', 'crossbody'], category: 'Women\'s Handbags', type: 'handbag' },
      { keywords: ['bag', 'bags'], category: 'Women\'s Handbags', type: 'bag' },
      { keywords: ['jacket', 'jackets', 'coat', 'blazer'], category: 'Women\'s Leather Jackets', type: 'jacket' },
      { keywords: ['wallet', 'cardholder'], category: 'Women\'s Accessories', type: 'wallet' },
      { keywords: ['accessory', 'accessories'], category: 'Women\'s Accessories', type: 'accessory' }
    ];

    // Find the first matching category (priority order)
    for (const { keywords, category, type } of categoryKeywords) {
      const matchingKeyword = keywords.find(keyword => query.includes(keyword));
      if (matchingKeyword) {
        criteria.category = category;
        criteria.type = matchingKeyword;
        break; // Stop at first match to prioritize specific terms
      }
    }

    // Extract gender
    if (query.includes('women') || query.includes('woman') || query.includes('ladies')) {
      criteria.gender = 'Women';
    } else if (query.includes('men') || query.includes('man') || query.includes('mens')) {
      criteria.gender = 'Men';
    }

    // Extract price keywords
    if (query.includes('cheap') || query.includes('budget') || query.includes('under 100')) {
      criteria.priceRange.max = 100;
    } else if (query.includes('expensive') || query.includes('premium') || query.includes('over 300')) {
      criteria.priceRange.min = 300;
    }

    // Extract other keywords
    const words = query.split(' ').filter(word => word.length > 2);
    criteria.keywords = words.filter(word => 
      !colorKeywords.includes(word) && 
      !Object.keys(categoryKeywords).includes(word) &&
      !['women', 'men', 'cheap', 'expensive', 'budget', 'premium'].includes(word)
    );

    return criteria;
  }

  // Perform search based on criteria
  performSearch(criteria) {
    let results = [...this.products];

    // Filter by category
    if (criteria.category) {
      results = results.filter(product => product.category === criteria.category);
    }

    // Filter by gender
    if (criteria.gender) {
      results = results.filter(product => product.gender === criteria.gender);
    }

    // Filter by colors
    if (criteria.colors.length > 0) {
      results = results.filter(product => 
        product.colors.some(color => criteria.colors.includes(color))
      );
    }

    // Filter by price range
    if (criteria.priceRange.min !== null || criteria.priceRange.max !== null) {
      const min = criteria.priceRange.min || 0;
      const max = criteria.priceRange.max || 10000;
      results = results.filter(product => 
        product.salePrice >= min && product.salePrice <= max
      );
    }

    // Filter by keywords
    if (criteria.keywords.length > 0) {
      results = results.filter(product => {
        const searchableText = [
          product.title,
          product.description,
          ...product.tags,
          ...product.searchTerms
        ].join(' ').toLowerCase();
        
        return criteria.keywords.some(keyword => 
          searchableText.includes(keyword.toLowerCase())
        );
      });
    }

    return results;
  }

  // Sort results by relevance
  sortByRelevance(results, criteria) {
    return results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Exact title match gets highest score
      if (a.title.toLowerCase().includes(criteria.keywords.join(' '))) scoreA += 100;
      if (b.title.toLowerCase().includes(criteria.keywords.join(' '))) scoreB += 100;

      // Tag matches
      criteria.keywords.forEach(keyword => {
        if (a.tags.some(tag => tag.toLowerCase().includes(keyword))) scoreA += 10;
        if (b.tags.some(tag => tag.toLowerCase().includes(keyword))) scoreB += 10;
      });

      // Search term matches
      criteria.keywords.forEach(keyword => {
        if (a.searchTerms.some(term => term.toLowerCase().includes(keyword))) scoreA += 5;
        if (b.searchTerms.some(term => term.toLowerCase().includes(keyword))) scoreB += 5;
      });

      return scoreB - scoreA;
    });
  }

  // Get related products
  getRelatedProducts(product, limit = 4) {
    const related = [];
    
    // Same category
    const sameCategory = this.products.filter(p => 
      p.category === product.category && p.id !== product.id
    );
    related.push(...sameCategory.slice(0, 2));

    // Same type
    const sameType = this.products.filter(p => 
      p.type === product.type && p.id !== product.id && !related.includes(p)
    );
    related.push(...sameType.slice(0, 1));

    // Same color
    const sameColor = this.products.filter(p => 
      p.colors.some(color => product.colors.includes(color)) && 
      p.id !== product.id && 
      !related.includes(p)
    );
    related.push(...sameColor.slice(0, 1));

    return related.slice(0, limit);
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Get product by handle
  getProductByHandle(handle) {
    return this.products.find(product => product.handle === handle);
  }

  // Get products by category
  getProductsByCategory(category) {
    return this.searchIndex.byCategory[category] || [];
  }

  // Get products by color
  getProductsByColor(color) {
    return this.searchIndex.byColor[color] || [];
  }

  // Get products by gender
  getProductsByGender(gender) {
    return this.searchIndex.byGender[gender] || [];
  }

  // Format product for display
  formatProduct(product) {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      type: product.type,
      gender: product.gender,
      description: product.description,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      colors: product.colors,
      sizes: product.sizes,
      url: product.url,
      imageUrl: product.imageUrl,
      isOnSale: product.originalPrice > product.salePrice,
      discount: product.originalPrice > product.salePrice ? 
        Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0
    };
  }

  // Generate search response
  generateSearchResponse(searchResult) {
    const { products, total, query, searchType } = searchResult;

    if (total === 0) {
      return this.generateNoResultsResponse(query);
    }

    if (total === 1) {
      return this.generateSingleProductResponse(products[0]);
    }

    return this.generateMultipleProductsResponse(products, total, query);
  }

  // Generate no results response
  generateNoResultsResponse(query) {
    let response = `**No products found** for "${query}"\n\n`;
    response += `**Try these suggestions:**\n\n`;
    
    // Suggest popular categories
    const popularCategories = ['Women\'s Handbags', 'Women\'s Leather Jackets', 'Men\'s Laptop Bags'];
    response += `• **Browse by category:** `;
    response += popularCategories.map(cat => `[${cat}](https://danier.com/collections/${cat.toLowerCase().replace(/\s+/g, '-')})`).join(' | ');
    response += `\n\n`;
    
    // Suggest popular products
    const popularProducts = this.products.slice(0, 3);
    response += `• **Popular products:**\n`;
    popularProducts.forEach(product => {
      response += `  - [${product.title}](${product.url}) - $${product.salePrice}\n`;
    });
    
    response += `\n[Browse Full Collection](https://danier.com/collections)`;
    
    return response;
  }

  // Generate single product response
  generateSingleProductResponse(product) {
    const formatted = this.formatProduct(product);
    let response = `**Perfect match found!**\n\n`;
    response += `**${formatted.title}**\n`;
    response += `Category: ${formatted.category}\n`;
    response += `Gender: ${formatted.gender}\n`;
    
    if (formatted.isOnSale) {
      response += `~~$${formatted.originalPrice}~~ **$${formatted.salePrice}** (${formatted.discount}% off)\n`;
    } else {
      response += `**$${formatted.salePrice}**\n`;
    }
    
    if (formatted.colors.length > 0) {
      response += `Available Colors: ${formatted.colors.join(', ')}\n`;
    }
    
    if (formatted.sizes.length > 0 && !formatted.sizes.includes('ONE SIZE')) {
      response += `Available Sizes: ${formatted.sizes.join(', ')}\n`;
    }
    
    if (formatted.description) {
      response += `\n${formatted.description}\n`;
    }
    
    response += `\n[View Product](${formatted.url})`;
    
    // Add related products
    const related = this.getRelatedProducts(product);
    if (related.length > 0) {
      response += `\n\n**You might also like:**\n`;
      related.forEach(rel => {
        response += `• [${rel.title}](${rel.url}) - $${rel.salePrice}\n`;
      });
    }
    
    return response;
  }

  // Generate multiple products response
  generateMultipleProductsResponse(products, total, query) {
    let response = `**Found ${total} products** for "${query}"\n\n`;
    
    // Show top 5 products
    const displayProducts = products.slice(0, 5);
    displayProducts.forEach(product => {
      const formatted = this.formatProduct(product);
      response += `**${formatted.title}**\n`;
      response += `$${formatted.salePrice}`;
      if (formatted.isOnSale) {
        response += ` (${formatted.discount}% off)`;
      }
      response += ` | [View](${formatted.url})\n\n`;
    });
    
    if (total > 5) {
      response += `*And ${total - 5} more items...*\n\n`;
    }
    
    response += `[Browse Full Collection](https://danier.com/collections)`;
    
    return response;
  }
}

export default CSVProductSearchService; 