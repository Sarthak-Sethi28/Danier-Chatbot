// Product Search Service for Danier Chatbot
// Integrates with backend API to provide intelligent product recommendations

class ProductSearchService {
  constructor() {
    this.backendURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
  }

  // Search products using backend API
  async searchWithFilters(userMessage) {
    try {
      console.log('ProductSearchService - Searching for:', userMessage);
      console.log('ProductSearchService - Backend URL:', this.backendURL);
      const response = await fetch(`${this.backendURL}/api/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          limit: 1000  // Request up to 1000 products to show all results
        }),
      });

      console.log('ProductSearchService - Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('ProductSearchService - Search result:', data);
      
      return {
        products: data.results || [],
        total: data.total || 0,
        searchType: data.searchType || 'unknown',
        response: data.response || '',
        hasFilters: true,
        filterSummary: []
      };
    } catch (error) {
      console.error('Error searching products:', error);
      console.error('Error details:', error.message);
      console.error('Backend URL was:', this.backendURL);
      
      // Return fallback response
      return {
        products: [],
        total: 0,
        searchType: 'error',
        response: `Connection error: Cannot reach backend at ${this.backendURL}. Error: ${error.message}`,
        hasFilters: false,
        filterSummary: []
      };
    }
  }

  // Generate response based on search results and filters
  generateSearchResponse(searchResult) {
    // Use the response from the backend directly
    return searchResult.response || "I couldn't find any products matching your search.";
  }

  // Generate follow-up questions (simplified for backend integration)
  generateFollowUpQuestions(filters) {
    return null; // Backend handles this
  }

  // Get current filters (simplified)
  getCurrentFilters() {
    return {};
  }

  // Clear all filters (simplified)
  clearFilters() {
    // No-op since backend handles filters
  }

  // Check if message is a filter refinement (simplified)
  isFilterRefinement(message) {
    return false; // Backend handles this
  }

  // Get filter summary (simplified)
  getFilterSummary() {
    return [];
  }
}

export default ProductSearchService; 