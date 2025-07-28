// Filter Parser Utility for Danier Chatbot
// Extracts and manages user filter preferences from chat messages

export const FILTER_TYPES = {
  CATEGORY: 'category',
  PRICE_RANGE: 'priceRange',
  COLOR: 'color',
  GENDER: 'gender',
  SEASON: 'season'
};

export const CATEGORIES = {
  JACKETS: 'jackets',
  HANDBAGS: 'handbags',
  LAPTOP_BAGS: 'laptop_bags',
  TRAVEL: 'travel',
  ACCESSORIES: 'accessories',
  SHOES: 'shoes',
  WALLETS: 'wallets',
  GLOVES: 'gloves'
};

export const COLORS = {
  BLACK: 'black',
  BROWN: 'brown',
  WHITE: 'white',
  SADDLE: 'saddle',
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green'
};

export const GENDERS = {
  WOMEN: 'women',
  MEN: 'men',
  UNISEX: 'unisex'
};

export const SEASONS = {
  SPRING: 'spring',
  FALL: 'fall',
  SUMMER: 'summer',
  WINTER: 'winter'
};

class FilterParser {
  constructor() {
    this.filters = {
      category: null,
      priceRange: { min: null, max: null },
      colors: [],
      gender: null,
      season: null
    };
  }

  // Extract filters from a user message
  extractFilters(message) {
    const lowerMessage = message.toLowerCase();
    const newFilters = { ...this.filters };

    // Extract category
    const category = this.extractCategory(lowerMessage);
    if (category) newFilters.category = category;

    // Extract price range
    const priceRange = this.extractPriceRange(lowerMessage);
    if (priceRange.min !== null || priceRange.max !== null) {
      newFilters.priceRange = { ...newFilters.priceRange, ...priceRange };
    }

    // Extract colors
    const colors = this.extractColors(lowerMessage);
    if (colors.length > 0) {
      newFilters.colors = [...new Set([...newFilters.colors, ...colors])];
    }

    // Extract gender
    const gender = this.extractGender(lowerMessage);
    if (gender) newFilters.gender = gender;

    // Extract season
    const season = this.extractSeason(lowerMessage);
    if (season) newFilters.season = season;

    // Update filters
    this.filters = newFilters;
    return newFilters;
  }

  // Extract category from message
  extractCategory(message) {
    const categoryMap = {
      'jacket': CATEGORIES.JACKETS,
      'leather jacket': CATEGORIES.JACKETS,
      'coat': CATEGORIES.JACKETS,
      'handbag': CATEGORIES.HANDBAGS,
      'bag': CATEGORIES.HANDBAGS,
      'purse': CATEGORIES.HANDBAGS,
      'satchel': CATEGORIES.HANDBAGS,
      'laptop': CATEGORIES.LAPTOP_BAGS,
      'computer': CATEGORIES.LAPTOP_BAGS,
      'work': CATEGORIES.LAPTOP_BAGS,
      'travel': CATEGORIES.TRAVEL,
      'luggage': CATEGORIES.TRAVEL,
      'trip': CATEGORIES.TRAVEL,
      'accessory': CATEGORIES.ACCESSORIES,
      'accessories': CATEGORIES.ACCESSORIES,
      'shoe': CATEGORIES.SHOES,
      'shoes': CATEGORIES.SHOES,
      'boot': CATEGORIES.SHOES,
      'boots': CATEGORIES.SHOES,
      'wallet': CATEGORIES.WALLETS,
      'glove': CATEGORIES.GLOVES,
      'gloves': CATEGORIES.GLOVES
    };

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (message.includes(keyword)) {
        return category;
      }
    }

    return null;
  }

  // Extract price range from message
  extractPriceRange(message) {
    const priceRange = { min: null, max: null };

    // Under $X
    const underMatch = message.match(/under\s*\$?(\d+)/);
    if (underMatch) {
      priceRange.max = parseInt(underMatch[1]);
    }

    // Over $X
    const overMatch = message.match(/over\s*\$?(\d+)/);
    if (overMatch) {
      priceRange.min = parseInt(overMatch[1]);
    }

    // Between $X and $Y
    const betweenMatch = message.match(/between\s*\$?(\d+)\s*(?:and|to|-)\s*\$?(\d+)/);
    if (betweenMatch) {
      priceRange.min = parseInt(betweenMatch[1]);
      priceRange.max = parseInt(betweenMatch[2]);
    }

    // $X-$Y format
    const rangeMatch = message.match(/\$?(\d+)\s*-\s*\$?(\d+)/);
    if (rangeMatch) {
      priceRange.min = parseInt(rangeMatch[1]);
      priceRange.max = parseInt(rangeMatch[2]);
    }

    // Exact price $X
    const exactMatch = message.match(/\$(\d+)/);
    if (exactMatch && !priceRange.min && !priceRange.max) {
      const price = parseInt(exactMatch[1]);
      priceRange.min = price;
      priceRange.max = price;
    }

    return priceRange;
  }

  // Extract colors from message
  extractColors(message) {
    const colors = [];
    const colorMap = {
      'black': COLORS.BLACK,
      'brown': COLORS.BROWN,
      'white': COLORS.WHITE,
      'saddle': COLORS.SADDLE,
      'red': COLORS.RED,
      'blue': COLORS.BLUE,
      'green': COLORS.GREEN
    };

    for (const [keyword, color] of Object.entries(colorMap)) {
      if (message.includes(keyword)) {
        colors.push(color);
      }
    }

    return colors;
  }

  // Extract gender from message
  extractGender(message) {
    if (message.includes('women') || message.includes('woman') || message.includes('ladies')) {
      return GENDERS.WOMEN;
    }
    if (message.includes('men') || message.includes('man') || message.includes('gentlemen')) {
      return GENDERS.MEN;
    }
    return null;
  }

  // Extract season from message
  extractSeason(message) {
    if (message.includes('spring')) return SEASONS.SPRING;
    if (message.includes('fall') || message.includes('autumn')) return SEASONS.FALL;
    if (message.includes('summer')) return SEASONS.SUMMER;
    if (message.includes('winter')) return SEASONS.WINTER;
    return null;
  }

  // Get current filters
  getFilters() {
    return { ...this.filters };
  }

  // Check if all required filters are set
  hasRequiredFilters() {
    return this.filters.category !== null;
  }

  // Check if specific filter is set
  hasFilter(type) {
    switch (type) {
      case FILTER_TYPES.CATEGORY:
        return this.filters.category !== null;
      case FILTER_TYPES.PRICE_RANGE:
        return this.filters.priceRange.min !== null || this.filters.priceRange.max !== null;
      case FILTER_TYPES.COLOR:
        return this.filters.colors.length > 0;
      case FILTER_TYPES.GENDER:
        return this.filters.gender !== null;
      case FILTER_TYPES.SEASON:
        return this.filters.season !== null;
      default:
        return false;
    }
  }

  // Clear specific filter
  clearFilter(type) {
    switch (type) {
      case FILTER_TYPES.CATEGORY:
        this.filters.category = null;
        break;
      case FILTER_TYPES.PRICE_RANGE:
        this.filters.priceRange = { min: null, max: null };
        break;
      case FILTER_TYPES.COLOR:
        this.filters.colors = [];
        break;
      case FILTER_TYPES.GENDER:
        this.filters.gender = null;
        break;
      case FILTER_TYPES.SEASON:
        this.filters.season = null;
        break;
    }
  }

  // Clear all filters
  clearAllFilters() {
    this.filters = {
      category: null,
      priceRange: { min: null, max: null },
      colors: [],
      gender: null,
      season: null
    };
  }

  // Get filter summary for display
  getFilterSummary() {
    const summary = [];
    
    if (this.filters.category) {
      summary.push(`Category: ${this.filters.category}`);
    }
    
    if (this.filters.priceRange.min !== null || this.filters.priceRange.max !== null) {
      if (this.filters.priceRange.min === this.filters.priceRange.max) {
        summary.push(`Price: $${this.filters.priceRange.min}`);
      } else if (this.filters.priceRange.min && this.filters.priceRange.max) {
        summary.push(`Price: $${this.filters.priceRange.min}-$${this.filters.priceRange.max}`);
      } else if (this.filters.priceRange.max) {
        summary.push(`Price: Under $${this.filters.priceRange.max}`);
      } else if (this.filters.priceRange.min) {
        summary.push(`Price: Over $${this.filters.priceRange.min}`);
      }
    }
    
    if (this.filters.colors.length > 0) {
      summary.push(`Colors: ${this.filters.colors.join(', ')}`);
    }
    
    if (this.filters.gender) {
      summary.push(`Gender: ${this.filters.gender}`);
    }
    
    if (this.filters.season) {
      summary.push(`Season: ${this.filters.season}`);
    }
    
    return summary;
  }

  // Check if message is a filter refinement
  isFilterRefinement(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for price refinements
    if (lowerMessage.includes('under') || lowerMessage.includes('over') || 
        lowerMessage.includes('between') || lowerMessage.includes('$')) {
      return true;
    }
    
    // Check for color refinements
    const colorKeywords = ['black', 'brown', 'white', 'saddle', 'red', 'blue', 'green'];
    if (colorKeywords.some(color => lowerMessage.includes(color))) {
      return true;
    }
    
    // Check for category refinements
    const categoryKeywords = ['jacket', 'handbag', 'laptop', 'travel', 'accessory'];
    if (categoryKeywords.some(category => lowerMessage.includes(category))) {
      return true;
    }
    
    return false;
  }
}

export default FilterParser; 