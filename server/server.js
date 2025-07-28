const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use OpenAI API key from environment
});

// Initialize Optimized Product Search Service
let OptimizedProductSearchService;
let productSearchService;
try {
  OptimizedProductSearchService = require('./optimizedProductSearchService');
  productSearchService = new OptimizedProductSearchService();
  console.log('✅ Optimized Product Search Service initialized');
} catch (error) {
  console.log('⚠️ Optimized Product Search Service not available:', error.message);
  productSearchService = null;
}

// Initialize FAQ Processor (if available)
let FAQProcessor;
let faqProcessor;
try {
  FAQProcessor = require(path.join(__dirname, '../scripts/faq-processor'));
  faqProcessor = new FAQProcessor();
  console.log('✅ FAQ Processor initialized');
} catch (error) {
  console.log('⚠️ FAQ Processor not available:', error.message);
  faqProcessor = null;
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    faq_available: faqProcessor !== null,
    product_search_available: productSearchService !== null,
    product_count: productSearchService ? productSearchService.products.length : 0
  });
});

// Product search endpoint
app.post('/api/products/search', async (req, res) => {
  if (!productSearchService) {
    return res.status(503).json({
      error: 'Product search service not available',
      message: 'Product search functionality is not configured'
    });
  }

  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'query is required',
        message: 'Please provide a search query'
      });
    }

    console.log(`🔍 Product search: "${query}"`);
    
    const searchResult = productSearchService.search(query, limit);
    const response = productSearchService.generateSearchResponse(searchResult);
    
    res.json({
      success: true,
      query: query,
      response: response,
      results: searchResult.products,
      total: searchResult.total,
      searchType: searchResult.searchType,
      filters: searchResult.filters
    });

  } catch (error) {
    console.error('❌ Product search error:', error);
    res.status(500).json({
      error: 'Product search failed',
      message: error.message
    });
  }
});

// Product recommendations endpoint
app.get('/api/products/recommendations', async (req, res) => {
  if (!productSearchService) {
    return res.status(503).json({
      error: 'Product search service not available',
      message: 'Product search functionality is not configured'
    });
  }

  try {
    const { category, gender, limit = 5 } = req.query;
    
    console.log(`🎯 Getting recommendations: category=${category}, gender=${gender}`);
    
    const recommendations = productSearchService.getRecommendations(category, gender, parseInt(limit));
    
    res.json({
      success: true,
      recommendations: recommendations,
      count: recommendations.length,
      category: category,
      gender: gender
    });

  } catch (error) {
    console.error('❌ Recommendations error:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

// Trending products endpoint
app.get('/api/products/trending', async (req, res) => {
  if (!productSearchService) {
    return res.status(503).json({
      error: 'Product search service not available',
      message: 'Product search functionality is not configured'
    });
  }

  try {
    const { limit = 5 } = req.query;
    
    console.log(`🔥 Getting trending products`);
    
    const trending = productSearchService.getTrendingProducts(parseInt(limit));
    
    res.json({
      success: true,
      trending: trending,
      count: trending.length
    });

  } catch (error) {
    console.error('❌ Trending products error:', error);
    res.status(500).json({
      error: 'Failed to get trending products',
      message: error.message
    });
  }
});

// Product categories endpoint
app.get('/api/products/categories', async (req, res) => {
  if (!productSearchService) {
    return res.status(503).json({
      error: 'Product search service not available',
      message: 'Product search functionality is not configured'
    });
  }

  try {
    const categories = {
      'jackets': {
        name: 'Leather Jackets',
        description: 'Premium leather jackets for men and women',
        count: productSearchService.products.filter(p => {
          return p.type && (p.type.includes('JA') || p.type.includes('CO') || p.type.includes('BO'));
        }).length
      },
      'handbags': {
        name: 'Handbags & Bags',
        description: 'Stylish leather handbags, satchels, and crossbody bags',
        count: productSearchService.products.filter(p => {
          return p.type && (p.type.includes('HB') || p.type.includes('CB') || p.type.includes('MB'));
        }).length
      },
      'wallets': {
        name: 'Wallets & Cardholders',
        description: 'Premium leather wallets and cardholders',
        count: productSearchService.products.filter(p => {
          return p.type && p.type.includes('WA');
        }).length
      },
      'accessories': {
        name: 'Accessories',
        description: 'Leather accessories and small leather goods',
        count: productSearchService.products.filter(p => {
          return p.type && (p.type.includes('GL') || p.type.includes('HA'));
        }).length
      }
    };
    
    res.json({
      success: true,
      categories: categories
    });

  } catch (error) {
    console.error('❌ Categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

// FAQ processing endpoint
app.post('/api/faq/process', async (req, res) => {
  if (!faqProcessor) {
    return res.status(503).json({
      error: 'FAQ processor not available',
      message: 'FAQ functionality is not configured'
    });
  }

  try {
    const { policyPath } = req.body;
    
    if (!policyPath) {
      return res.status(400).json({
        error: 'policyPath is required',
        message: 'Please provide the path to the policy document or directory'
      });
    }

    const fullPath = path.resolve(policyPath);
    
    // Check if file/directory exists
    if (!require('fs').existsSync(fullPath)) {
      return res.status(404).json({
        error: 'Policy path not found',
        message: `The path ${policyPath} does not exist`
      });
    }

    console.log(`🚀 Processing FAQ policies from: ${fullPath}`);
    
    const results = await faqProcessor.processPolicies(fullPath);
    
    res.json({
      success: true,
      results: results,
      message: 'FAQ processing completed successfully'
    });

  } catch (error) {
    console.error('❌ FAQ processing error:', error);
    res.status(500).json({
      error: 'FAQ processing failed',
      message: error.message
    });
  }
});

// FAQ search endpoint (for testing)
app.post('/api/faq/search', async (req, res) => {
  if (!faqProcessor) {
    return res.status(503).json({
      error: 'FAQ processor not available',
      message: 'FAQ functionality is not configured'
    });
  }

  try {
    const { query, topK = 3 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'query is required',
        message: 'Please provide a search query'
      });
    }

    console.log(`🔍 FAQ search: "${query}"`);
    
    const results = faqProcessor.searchFAQ(query, topK);
    
    res.json({
      success: true,
      query: query,
      results: results,
      count: results.length
    });

  } catch (error) {
    console.error('❌ FAQ search error:', error);
    res.status(500).json({
      error: 'FAQ search failed',
      message: error.message
    });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request body. Expected messages array.',
        example: {
          messages: [
            { role: 'user', content: 'Hello, how can you help me?' }
          ]
        }
      });
    }

    // Validate message structure
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({
          error: 'Each message must have role and content properties.',
          example: {
            role: 'user',
            content: 'Hello, how can you help me?'
          }
        });
      }
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.'
      });
    }

    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1];
    const userQuestion = latestUserMessage.content;



    // Check if this is an FAQ-related question
    let faqResponse = null;
    let faqUsed = false;
    let faqCategory = null;
    
    // Product search variables
    let productResponse = null;
    let productUsed = false;

    // Check if it's an FAQ query first
    if (faqProcessor && faqProcessor.isFAQRelated(userQuestion).isFAQ) {
      console.log(`❓ FAQ query detected: "${userQuestion}"`);
      
      try {
        const faqResults = faqProcessor.searchFAQ(userQuestion, 1);
        if (faqResults.length > 0) {
          faqResponse = faqResults[0].answer;
          faqUsed = true;
          faqCategory = faqResults[0].category;
          console.log(`✅ Found FAQ answer in category: ${faqCategory}`);
          
          // 🚀 CRITICAL FIX: Return FAQ response immediately without calling OpenAI
          console.log('🚀 FAQ DETECTED - Returning FAQ response immediately');
          return res.json({
            success: true,
            message: {
              role: 'assistant',
              content: faqResponse
            },
            faq_used: true,
            faq_category: faqCategory,
            product_used: false,
            product_count: 0
          });
        }
      } catch (error) {
        console.error('❌ FAQ search error:', error);
        // Continue with regular chat if FAQ search fails
      }
    }

    // 🛍️ PRODUCT SEARCH LOGIC - Only run if NOT an FAQ query
    if (productSearchService && !faqUsed) {
      console.log(`🔍 Product search for: "${userQuestion}"`);
      
      try {
        const searchResults = productSearchService.search(userQuestion, 10);
        console.log(`✅ Found ${searchResults.total} products`);
        
        if (searchResults.total > 0) {
          productUsed = true;
          // Simple response that lets frontend handle the dropdown
          productResponse = `Great! I found ${searchResults.total} ${userQuestion.toLowerCase().includes('jacket') ? 'jackets' : 'products'} that match your search. Check out the options below!`;
          
          console.log(`📦 Product search successful - ${searchResults.total} products found`);
        } else {
          console.log(`❌ No products found for: "${userQuestion}"`);
        }
      } catch (error) {
        console.error('❌ Product search error:', error);
      }
    }



    // Create system message for Danier context (only when using OpenAI)
    const systemMessage = {
      role: 'system',
      content: `You are an expert customer service representative for Danier, a premium leather goods retailer. You are knowledgeable, helpful, and always provide the best possible user experience.

DANIER PRODUCT CATALOG:
- **${productSearchService ? productSearchService.products.length : 0} active products** in our Spring 2025 collection
- **Categories**: Leather Jackets, Handbags & Bags, Wallets & Cardholders, Accessories
- **Colors**: Black, Brown, White, Saddle, Blue, Red, Grey, and more
- **Price Range**: $29 - $597 with regular sales and discounts
- **Quality**: 100% Genuine Leather, Premium Craftsmanship

CORE RESPONSIBILITIES:
1. **Product Expert**: Provide detailed, accurate information about Danier products
2. **Personal Shopper**: Help customers find the perfect items based on their needs
3. **Style Advisor**: Offer fashion advice and styling suggestions
4. **Customer Advocate**: Ensure every interaction is helpful and satisfying

CONVERSATION GUIDELINES:

**🎯 SMART SEARCHING:**
- When users ask about products, use the product search system to find exact matches
- Support complex queries: "black leather jackets for men under $500"
- Handle price ranges: "under $300", "between $200-400", "over $400"
- Remember user preferences throughout the conversation

**💡 INTELLIGENT RECOMMENDATIONS:**
- Suggest trending products and best sellers
- Recommend complementary items
- Consider user's budget and style preferences
- Highlight sale items and special offers

**🛍️ PRODUCT KNOWLEDGE:**
- Know our product categories and features
- Understand leather types and care instructions
- Be familiar with sizing and fit information
- Highlight unique selling points

**🎨 STYLE GUIDANCE:**
- Offer styling tips and outfit suggestions
- Help with gift recommendations
- Suggest seasonal collections
- Provide care and maintenance advice

**📱 USER EXPERIENCE:**
- Keep responses conversational but efficient
- Use clear, helpful language
- Provide specific product recommendations
- Include direct links to products
- Offer alternatives when items are out of stock

**🔧 TECHNICAL CAPABILITIES:**
- Search by category, color, gender, and price
- Filter by sale items and discounts
- Show trending and recommended products
- Provide detailed product information

RESPONSE FORMAT:
- Use **bold** for product names and prices
- Include bullet points for product lists
- Add clear sections with headers
- Always include product links: [Product Name](https://danier.com/product-url)
- Show discounts and sale prices prominently

FALLBACK STRATEGIES:
- If no exact matches, suggest similar products
- Recommend browsing the full collection
- Offer to help refine the search
- Provide category overviews

Remember: Every customer interaction should feel personal, helpful, and informative. You're here to make their shopping experience exceptional!`
    };

    // Prepare messages for OpenAI (include system message)
    const openaiMessages = [systemMessage, ...messages];

    // 🚀 CRITICAL FIX: Skip OpenAI if we have product results or FAQ results
    let assistantMessage = null;
    let completion = null;
    
    if (!faqUsed && !productUsed) {
      // Only call OpenAI for general conversation (not product search or FAQ)
      console.log('🤖 Using OpenAI for general conversation...');
      completion = await openai.chat.completions.create({
        model: 'gpt-4', // Use GPT-4 for best results
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      assistantMessage = completion.choices[0].message;
    } else {
      console.log('✅ Skipping OpenAI - using product/FAQ response directly');
    }

    // Return the response with product or FAQ information
    res.json({
      success: true,
      message: faqUsed ? { role: 'assistant', content: faqResponse } : (productUsed ? { role: 'assistant', content: productResponse } : assistantMessage),
      usage: completion?.usage || null,
      model: completion?.model || null,
      product_used: productUsed,
      product_count: productUsed ? productSearchService.search(userQuestion, 1).total : 0,
      faq_used: faqUsed,
      faq_category: faqCategory
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);

    // Handle specific OpenAI errors and provide fallback responses
    if (error.status === 429) {
      // Rate limit exceeded - provide helpful message
      return res.json({
        success: true,
        message: { 
          role: 'assistant', 
          content: "I'm experiencing high demand right now. However, I can still help you search for products! Please try asking about specific items like 'black leather jacket' or 'women's handbags'." 
        },
        product_used: false,
        product_count: 0,
        faq_used: false,
        faq_category: null,
        openai_error: 'Rate limit exceeded'
      });
    }

    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid OpenAI API key. Please check your configuration.'
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        error: 'Invalid request to OpenAI API.',
        details: error.message
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error. Please try again later.',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong.'
    });
  }
});

// Helper function to detect product queries
function isProductQuery(query) {
  if (!query || typeof query !== 'string') return false;
  
  const productKeywords = [
    'jacket', 'jackets', 'handbag', 'handbags', 'bag', 'bags', 'laptop', 'accessory', 'accessories',
    'wallet', 'cardholder', 'satchel', 'crossbody', 'camera bag', 'leather', 'price', 'cost',
    'black', 'brown', 'white', 'saddle', 'red', 'blue', 'green', 'women', 'men', 'buy', 'purchase',
    'show me', 'find', 'search', 'looking for', 'need', 'want', 'under', 'over', 'between'
  ];
  
  const normalizedQuery = query.toLowerCase();
  return productKeywords.some(keyword => normalizedQuery.includes(keyword));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/chat'
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Danier Chatbot Server running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`💬 Chat API: http://localhost:${port}/api/chat`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set. Chat functionality will not work.');
  }
});

module.exports = app; 