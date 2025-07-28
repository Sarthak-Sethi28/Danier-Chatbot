import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import OptimizedProductSearchService from '../utils/optimizedProductSearchService';
import ProductResultsDropdown from './ProductResultsDropdown';
import { 
  searchProducts, 
  getProductsByCategory, 
  getProductsByPriceRange,
  getProductsByColor,
  formatPrice,
  formatPriceForText,
  formatPriceWithSale,
  getCategoryDisplayName,
  PRODUCT_CATEGORIES,
  getCurrentSeason
} from '../data/danierProducts';

// Get API URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// BULLETPROOF FAQ DATABASE - NO SERVER DEPENDENCIES
const FAQ_DATABASE = {
  "return policy": {
    category: "Returns & Exchanges",
    answer: `**RETURN POLICY**: Our policy for returns and exchanges is as follows:

• **Regular and Sale-Priced Items**: Eligible for return or size exchange within 10 days from the delivery date
• **Prepaid Return Label**: A one-time prepaid return label is available for size exchange or online store credit for domestic orders only
• **Refunds**: Customers requesting a refund are responsible for the return shipping costs
• **Clearance Items**: Items ending with $0.88 or $0.99 are final sale and are not eligible for return

**Online Returns**: Please use our return portal at https://danier.com/a/returns

For size exchanges or online store credit on regular and sale-priced items totaling $100 before tax, we provide a prepaid return label. However, please note that customers requesting a refund are responsible for the return shipping costs.`
  },
  "exchange": {
    category: "Returns & Exchanges", 
    answer: `**EXCHANGE PROCESS**: To exchange your items:

• Items must be returned within **10 days of delivery**
• Items must be in **original condition** with tags attached
• Use our online return portal: **https://danier.com/a/returns**
• Select "Exchange" option during the return process
• For size exchanges on orders $100+, we provide a **prepaid return label**
• Processing time: **5-7 business days** after we receive your item

**EXCHANGE LOCATIONS**: You can also exchange items at any Danier retail location with your receipt.`
  },
  "damaged items": {
    category: "Returns & Exchanges",
    answer: `**DAMAGED ITEMS**: If you received damaged items:

• Contact us **immediately** with photos of the damage
• We'll provide a **prepaid return label** at no cost to you
• **Full refund or replacement** will be provided
• **No questions asked** for manufacturing defects
• Email us at customer service with your order number and photos

We stand behind the quality of our products and will make it right.`
  },
  "shipping": {
    category: "Shipping & Delivery",
    answer: `**SHIPPING INFORMATION**:

• **Standard Shipping**: 5-7 business days ($10 CAD)
• **Express Shipping**: 2-3 business days ($20 CAD)
• **Free shipping** on orders over $150 CAD
• **Same-day delivery** available in Toronto and Vancouver
• **International shipping** available to select countries

**TRACKING**: You'll receive a tracking number via email once your order ships.`
  },
  "store locations": {
    category: "Store Information",
    answer: `**DANIER STORE LOCATIONS**:

**ONTARIO LOCATIONS**:
• **Oshawa Shopping Centre** - 905-723-8282 (Manager: Holly Jenkinson)
• **Vaughan Mills** - 905-760-7776 (Manager: Michael Kolkas)
• **Outlet Collection at Niagara** - 905-704-4545 (Manager: Saher Ghaboun)
• **Scarborough Town Centre** - 416-290-5050 (Manager: Cecilia Lee)
• **Fallsview Casino** - 905-356-6868 (Manager: Donna Louise David)
• **Conestoga Mall** - 519-725-3030 (Manager: Andrea Hancock)
• **First Canadian Place** - 416-861-1616 (Manager: Jamie Turner)
• **Toronto Premium Outlets** - 905-875-3113 (Manager: Maria Kiradziev)
• **CrossIron Mills** - 403-516-8837 (Manager: Ricarda Alvarez)

**QUEBEC LOCATIONS**:
• **Bayshore Shopping Centre** - 613-726-8989 (Manager: Kristen Collis)

**BRITISH COLUMBIA LOCATIONS**:
• **Tsawwassen Mills** - 604-382-5023 (Manager: Vanessa Valerio)
• **Metropolis at Metrotown** - 236-520-1720 (Manager: Jai Priya Sharma)

**MANITOBA LOCATIONS**:
• **Outlet Collection Winnipeg** - 204-488-1885 (Manager: Aileen De Jesus)

**SASKATCHEWAN LOCATIONS**:
• **Midtown Plaza** - 306-952-1882 (Manager: Lana Carriere)

**NOVA SCOTIA LOCATIONS**:
• **Halifax Shopping Centre** - 902-453-0622 (Manager: Jahnvi Bali)

**NEWFOUNDLAND LOCATIONS**:
• **Avalon Mall** - 709-722-9741 (Manager: Marlene Bishop)

**Store hours**: Monday-Saturday 10am-9pm, Sunday 11am-7pm
For specific store details, visit: **danier.com/pages/store-locator**`
  },
  "size guide": {
    category: "Sizing & Fit",
    answer: `**SIZING GUIDE**:

**LEATHER JACKETS**:
• XS: 32-34" chest
• S: 36-38" chest  
• M: 40-42" chest
• L: 44-46" chest
• XL: 48-50" chest

**BELT SIZING**:
• Measure your waist where you normally wear your belt
• Add 2 inches to your waist measurement for proper fit
• Our belts have 5 adjustment holes for flexibility

For specific measurements, visit: **danier.com/pages/size-guide**`
  },
  "care instructions": {
    category: "Product Care",
    answer: `**LEATHER CARE INSTRUCTIONS**:

**CLEANING**:
• Use only leather-specific cleaners
• Test on hidden area first
• Apply with soft, damp cloth
• Allow to air dry completely

**STORAGE**:
• Store in cool, dry place
• Use padded hangers for jackets
• Avoid plastic bags - use breathable garment bags
• Keep away from direct sunlight

**MAINTENANCE**:
• Condition leather 2-3 times per year
• Use our recommended leather care products available in-store`
  },
  "discount coupon": {
    category: "Promotions & Discounts",
    answer: `**DISCOUNT COUPONS**:

**$25 FIRST-TIME PURCHASE DISCOUNT**:
• We have a **$25 discount code** for first-time purchases
• Please **sign up** for the $25 discount code through the **pop-up on the website**
• The signup discount coupon is **eligible for regular-priced and sale items**
• The discount code **does NOT apply** on clearance and selective items
• **Minimum purchase value** for the discount should be **$250 before tax**

**HOW TO GET YOUR DISCOUNT**:
1. Visit our website
2. Look for the pop-up signup form
3. Enter your email to receive the $25 discount code
4. Use code at checkout (minimum $250 purchase before tax)

*Note: Discount excludes clearance items and select products*`
  },
  "damages": {
    category: "Returns & Exchanges",
    answer: `**DAMAGED PRODUCTS POLICY**:

If you received a damaged product, please **email the following information** to **customercare@danier.com** for them to further look into your request:

**REQUIRED INFORMATION**:
• **Date and location of purchase**
• **Transaction number (POS-###-####) or Order ID#**
• **Product name or style number** (if available)
• **Photos of product**, including full body, label and damaged area

**OUR RESPONSE**:
• We will review your case promptly
• Full refund or replacement will be provided for manufacturing defects
• We stand behind the quality of our products

**CONTACT**: customercare@danier.com`
  },
  "alterations": {
    category: "Services",
    answer: `**ALTERATIONS POLICY**:

**IMPORTANT**: We do **NOT provide alterations/repairs** at Danier.

**RECOMMENDATIONS**:
• We are unable to recommend a tailor
• We suggest **looking for a specialist in your area**
• Check local directories for leather alteration services
• Many dry cleaners offer leather alteration services

**SIZING TIP**: To avoid alterations, please refer to our size guide before purchasing to select the most appropriate size for your needs.`
  },
  "belt size": {
    category: "Sizing & Fit", 
    answer: `**BELT SIZE INQUIRY**:

**HOW TO DETERMINE BELT SIZE**:
• **Wrap a tape measure** around your waist, dress, or belt loop
• Depending on the type of clothing you're wearing
• Choose the **closest size to your waist measurement**

**SIZING EXAMPLES**:
• For example, waist measures 31" → purchase belt size 32
• Or waist size 40" → purchase belt size 40

**IMPORTANT NOTES**:
• Please note as **each belt style is different** these are only suggestions
• We **cannot guarantee a fit** on any item
• Each belt style may fit differently

**TIP**: When in doubt, size up rather than down for comfort.`
  },
  "currency": {
    category: "Payment & Pricing",
    answer: `**CURRENCY & PRICING**:

**USD TO CAD CONVERSION**:
• Our website features a **USD currency converter app**
• However, we regret to inform you that the **converted amount is NOT applied at checkout**
• The pricing will **revert to CAD** during checkout
• Please rest assured that **your card will still be charged the USD price** as displayed during the initial conversion

**IMPORTANT**: 
• All prices displayed are in **Canadian Dollars (CAD)** unless otherwise noted
• Currency conversion is for reference only
• Final charges will be processed in the currency shown at checkout`
  },
  "gift cards": {
    category: "Payment & Services",
    answer: `**GIFT CARDS POLICY**:

**IMPORTANT RESTRICTIONS**:
1. **We do NOT sell gift cards** at Danier
2. **Store credits provided in store** can be used at any location however **cannot be used online**
3. **Online store credits** can only be used online

**STORE CREDIT USAGE**:
• In-store credits: Physical stores only
• Online credits: Website only
• Credits cannot be transferred between store/online systems

**ALTERNATIVE**: Consider purchasing items as gifts with our flexible return policy (10-day return window).`
  },
  "store availability": {
    category: "Inventory & Stock",
    answer: `**HOW TO CHECK IN-STORE AVAILABILITY**:

**PROCESS**:
• Kindly provide the **style name, colour, and size** you're interested in
• We will be happy to **check which specific locations have the item** you're looking for

**CONTACT METHODS**:
• **Call any store location** directly (see store locations for phone numbers)
• **Visit our website** for online inventory
• **Email us** with your specific requirements

**WHAT WE NEED**:
• Product style name or number
• Preferred color
• Your size
• Preferred store location (if any)

**Note**: Inventory changes frequently, so we recommend calling ahead before visiting.`
  },
  "pickup locations": {
    category: "Store Services",
    answer: `**PICKUP LOCATIONS FOR ONLINE ORDERS**:

**IMPORTANT**: We only have **ONE location for pick-up** for online orders:

**📍 PICKUP LOCATION**:
**Address**: 7700 Keele St Unit 4, Vaughan, ON, L4K 2A1

**DETAILS**:
• This is our **only pickup location** for online orders
• Not available at retail store locations
• Please ensure your order is ready before visiting
• Bring your order confirmation and ID for pickup

**ALTERNATIVE**: Consider direct shipping to your address for convenience.`
  }
};

// FAQ DETECTION PATTERNS
const FAQ_PATTERNS = [
  { pattern: /return\s*policy|returns/i, key: "return policy" },
  { pattern: /exchange|swap|size\s*change/i, key: "exchange" },
  { pattern: /damaged|defect|broken|quality|damage/i, key: "damages" },
  { pattern: /shipping|delivery|tracking/i, key: "shipping" },
  { pattern: /store|location|address|hours|phone|contact|manager|mall|centre|directory/i, key: "store locations" },
  { pattern: /size|sizing|measurements|fit/i, key: "size guide" },
  { pattern: /care|clean|maintain|condition|storage/i, key: "care instructions" },
  { pattern: /discount|coupon|promo|promotion|offer|deal|code/i, key: "discount coupon" },
  { pattern: /alteration|alter|tailor|repair|fix|hem/i, key: "alterations" },
  { pattern: /belt\s*size|belt\s*measurement|belt\s*fitting/i, key: "belt size" },
  { pattern: /currency|usd|cad|dollar|price|conversion|exchange\s*rate|converter|app|charged|checkout/i, key: "currency" },
  { pattern: /gift\s*card|store\s*credit|credit\s*card/i, key: "gift cards" },
  { pattern: /availability|stock|inventory|in\s*store|check\s*store/i, key: "store availability" },
  { pattern: /pickup|pick\s*up|collection|collect/i, key: "pickup locations" }
];

const ChatWidget = () => {
  // Force reload - version 2.0
  console.log('🔄 ChatWidget loaded - Version 2.0 -', new Date().toISOString());
  
  // Force cache refresh on load
  useEffect(() => {
    console.log('🔄 HYBRID ChatWidget mounted - clearing any cached responses');
    // Clear any cached responses
    if (window.location.search.includes('cache-bust')) {
      console.log('✅ Cache busting detected, clearing all state');
      setMessages([
        {
          id: 1,
          text: `🎉 Welcome to Danier! I'm your personal shopping assistant`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setShowDropdown(false);
      setDropdownProducts([]);
      // Remove cache-bust parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
          text: `🎉 Welcome to Danier! I'm your personal shopping assistant`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownProducts, setDropdownProducts] = useState([]);
  const [dropdownTotal, setDropdownTotal] = useState(0);
  const [dropdownSearchQuery, setDropdownSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const productSearchService = useRef(new OptimizedProductSearchService());

  // Set default welcome message directly in useState
  // REMOVE the useEffect that loads chat history from localStorage
  // REMOVE the useEffect that saves chat history to localStorage

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Convert frontend messages to OpenAI format
  const convertMessagesToOpenAIFormat = (messages) => {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
  };

  // Send message to backend API
  const sendMessageToAPI = async (userMessage, conversationHistory) => {
    try {
      console.log('📞 sendMessageToAPI called with:', userMessage);
      console.log('🕐 Timestamp:', new Date().toISOString());
      const requestBody = {
        messages: conversationHistory
      };
      
      console.log('📤 Request URL:', `${API_BASE_URL}/api/chat`);
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 API Response data:', JSON.stringify(data, null, 2));
      return data; // Return full response object, not just content
    } catch (error) {
      console.error('❌ Error sending message to API:', error);
      console.error('❌ API Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { success: false, error: error.message };
    }
  };



  // HYBRID SYSTEM: FAQ (bulletproof) + Product Search (existing)
  const detectFAQ = (query) => {
    const lowerQuery = query.toLowerCase();
    
    for (const { pattern, key } of FAQ_PATTERNS) {
      if (pattern.test(lowerQuery)) {
        return FAQ_DATABASE[key];
      }
    }
    
    return null;
  };

  // NATURAL LANGUAGE PROCESSING FOR PRODUCT RECOMMENDATIONS
  const extractProductIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract product types
    const productKeywords = {
      'bag': ['bag', 'handbag', 'purse', 'tote', 'satchel', 'crossbody', 'clutch'],
      'jacket': ['jacket', 'coat', 'blazer', 'outerwear'],
      'belt': ['belt', 'waist', 'leather belt'],
      'wallet': ['wallet', 'billfold'],
      'gloves': ['gloves', 'mittens'],
      'boots': ['boots', 'footwear', 'shoes']
    };
    
    // Extract colors
    const colorKeywords = ['black', 'brown', 'red', 'blue', 'white', 'tan', 'navy', 'grey', 'gray', 'burgundy', 'cognac'];
    
    // Extract intent (recommendation vs search)
    const recommendKeywords = ['recommend', 'suggest', 'best', 'good', 'perfect', 'ideal', 'favorite'];
    
    let productType = null;
    let colors = [];
    let isRecommendation = false;
    
    // Find product type
    for (const [type, keywords] of Object.entries(productKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        productType = type;
        break;
      }
    }
    
    // Find colors
    colors = colorKeywords.filter(color => lowerMessage.includes(color));
    
    // Check if asking for recommendation
    isRecommendation = recommendKeywords.some(keyword => lowerMessage.includes(keyword));
    
    return { productType, colors, isRecommendation };
  };

  const generatePersonalizedResponse = (intent, searchResult, userMessage) => {
    const { productType, colors, isRecommendation } = intent;
    const productCount = searchResult.products.length;
    
    if (isRecommendation && productType) {
      let response = `Great choice! Based on your preferences, I'd recommend these ${productType}s`;
      
      if (colors.length > 0) {
        response += ` in ${colors.join(', ')}`;
      }
      
      response += `. Here are my top picks:\n\n`;
      
      // Add specific product highlights
      if (productCount > 0) {
        const topProduct = searchResult.products[0];
        response += `✨ **${topProduct.name}** - ${topProduct.price} is particularly popular`;
        
        if (colors.length > 0 && colors.some(color => topProduct.name.toLowerCase().includes(color))) {
          response += ` and comes in your preferred colors`;
        }
        response += `!\n\n`;
      }
      
      response += `I've found **${productCount} options** that match what you're looking for. Check them out below! 👇`;
      
      return response;
    }
    
    // Default product search response
    if (productType) {
      let response = `Perfect! I found **${productCount} ${productType}s**`;
      
      if (colors.length > 0) {
        response += ` available in ${colors.join(', ')}`;
      }
      
      response += `. Take a look at these options below! 👇`;
      return response;
    }
    
    // Generic response
    return `I found **${productCount} products** matching your search. Here are the results:`;
  };

  const getBotResponse = async (userMessage) => {
    try {
      console.log('🔄 HYBRID getBotResponse called with:', userMessage);
      console.log('🔥 VERSION: BACKEND-POWERED ASSISTANT');
      
      // STEP 1: BULLETPROOF FAQ DETECTION (NO SERVER NEEDED)
      console.log('🕵️ Step 1: Checking for FAQ patterns...');
      const faqResponse = detectFAQ(userMessage);
      
      if (faqResponse) {
        console.log('🎯 FAQ DETECTED!', faqResponse.category);
        console.log('📋 FAQ Response will be instant - no server calls needed');
        
        // Clear any existing dropdown state
        console.log('🧹 CLEARING DROPDOWN FOR FAQ');
        setShowDropdown(false);
        setDropdownProducts([]);
        setDropdownTotal(0);
        setDropdownSearchQuery('');
        
        return faqResponse.answer;
      }
      
      // STEP 2: USE BACKEND API FOR PRODUCT SEARCH
      console.log('🛍️ Step 2: Calling backend API for product search...');
      
      // Clear dropdown first
      console.log('🧹 CLEARING DROPDOWN BEFORE PRODUCT SEARCH');
      setShowDropdown(false);
      setDropdownProducts([]);
      setDropdownTotal(0);
      setDropdownSearchQuery('');
      
      try {
        console.log('🔍 CALLING BACKEND API...');
        console.log('🔍 Search query:', userMessage);
        
        // Convert to OpenAI format for backend
        const conversationHistory = [
          { role: 'user', content: userMessage }
        ];
        
        // Call the backend API
        const backendResponse = await sendMessageToAPI(userMessage, conversationHistory);
        console.log('📥 Backend response:', backendResponse);
        
        if (backendResponse && backendResponse.success && backendResponse.product_used && !backendResponse.error) {
          console.log('✅ PRODUCT SEARCH SUCCESS - Found:', backendResponse.product_count, 'products');
          
          // Use the backend's product count and get products for dropdown
          if (backendResponse.product_count > 0) {
            console.log('🔍 Getting products for dropdown...');
            
            // Initialize service if needed
            if (!productSearchService.current.initialized) {
              console.log('🔄 Initializing search service...');
              await productSearchService.current.initialize();
            }
            
            // Use the backend's product search results directly instead of frontend filtering
            // This ensures we show the same products that the backend found
            console.log('🔍 Getting products from backend search results...');
            
            // Call the backend's product search API directly to get the actual products
            const productSearchResponse = await fetch(`/api/products/search`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: userMessage,
                limit: Math.min(backendResponse.product_count, 100) // Show up to 100 products
              }),
            });

            if (productSearchResponse.ok) {
              const productData = await productSearchResponse.json();
              console.log('📦 Backend product search returned:', productData.results.length, 'products');
              
              if (productData.results && productData.results.length > 0) {
                setDropdownProducts(productData.results);
                setDropdownTotal(backendResponse.product_count);
                setDropdownSearchQuery(userMessage);
                setShowDropdown(true);
              }
            } else {
              console.log('⚠️ Backend product search failed, using fallback');
              // Fallback to frontend search if backend product search fails
              const searchWords = userMessage.toLowerCase().split(' ').filter(word => word.length > 0);
              const matchingProducts = productSearchService.current.products.filter(product => {
                const productText = `${product.name} ${product.type} ${product.colors} ${product.gender}`.toLowerCase();
                return searchWords.some(word => productText.includes(word));
              }).slice(0, Math.min(backendResponse.product_count, 100)); // Show up to 100 products
              
              if (matchingProducts.length > 0) {
                setDropdownProducts(matchingProducts);
                setDropdownTotal(backendResponse.product_count);
                setDropdownSearchQuery(userMessage);
                setShowDropdown(true);
              }
            }
          }
          
          return backendResponse.message.content;
        } else if (backendResponse && backendResponse.success && backendResponse.faq_used) {
          console.log('✅ FAQ RESPONSE from backend');
          return backendResponse.message.content;
        } else {
          console.log('❌ Backend API failed, falling back to local search');
          throw new Error('Backend response invalid');
        }
      } catch (apiError) {
        console.error('❌ Backend API error:', apiError);
        console.error('❌ Error details:', {
          message: apiError.message,
          stack: apiError.stack,
          name: apiError.name
        });
        return `I'm having trouble connecting to our product database right now. Please try again in a moment!`;
      }
    } catch (error) {
      console.error('💥 CRITICAL ERROR in getBotResponse:', error);
      
      return `I'm having some technical difficulties, but I can still help with your questions! 😊

Try asking me about:
• **Return policy** - "what is your return policy?"
• **Exchanges** - "how do I exchange items?"
• **Shipping** - "shipping information"  
• **Store locations** - "store locations"

These responses work independently and are always available!`;
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      // URGENT FIX: Clear ALL dropdown state at the start of a new message
      console.log('🧹 CLEARING ALL DROPDOWN STATE AT MESSAGE START');
      setShowDropdown(false);
      setDropdownProducts([]);
      setDropdownTotal(0);
      setDropdownSearchQuery('');
      
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsLoading(true);
      
      try {
        // Get bot response
        const botResponseText = await getBotResponse(message);
        
        const botResponse = {
          id: messages.length + 2,
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Error getting bot response:', error);
        
        const errorResponse = {
          id: messages.length + 2,
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: 1,
        text: `🎉 Welcome to Danier! I'm your personal shopping assistant`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    // Clear filters when chat is reset
    productSearchService.current.clearFilters();
    // Hide dropdown when clearing chat
    setShowDropdown(false);
    setDropdownProducts([]);
  };

  // Test function to verify Markdown rendering and localStorage
  const testMarkdownAndStorage = () => {
    const testMessage = {
      id: Date.now(),
      text: `**Test Markdown Rendering**\n\n• **Bold text** works\n• *Italic text* works\n• [Link text](https://danier.com) should be styled\n• \`code\` should be highlighted\n\nThis tests:\n1. Bold formatting\n2. Lists\n3. Links\n4. Code blocks`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, testMessage]);
  };

  // Test function for filter persistence
  const testFilterPersistence = () => {
    const testMessage = {
      id: Date.now(),
      text: `**Current Search State:**\n\nUsing Smart product database with ${productSearchService.current.products?.length || 0} products\n\nTry saying "red bags for women" to test search!`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, testMessage]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Component to render price with sale styling
  const PriceDisplay = ({ product }) => {
    const priceInfo = formatPriceWithSale(product);
    
    if (priceInfo.onSale) {
      return (
        <span className="inline-flex items-center space-x-2">
          <span className="text-red-600 font-semibold">{priceInfo.displayPrice}</span>
          <span className="text-gray-500 line-through">{priceInfo.originalPrice}</span>
        </span>
      );
    } else {
      return <span className="font-semibold">{priceInfo.displayPrice}</span>;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-danier-800 hover:bg-danier-700 
          text-white flex items-center justify-center transition-all duration-300
          chat-button-shadow hover:scale-110
          ${isOpen ? 'rotate-180' : ''}
        `}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[50vw] h-[70vh] max-w-md max-h-[600px] bg-white rounded-lg shadow-xl chat-widget-shadow border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-danier-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-danier-800 rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chat with Us</h3>
                <p className="text-xs text-gray-500">
                  {getCurrentSeason() === 'SP25' ? 'Spring 2025' : 'Fall 2025'} Collection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={testFilterPersistence}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Test Filters"
                title="Test filter persistence"
              >
                <span className="text-xs text-gray-500">F</span>
              </button>
              <button
                onClick={testMarkdownAndStorage}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Test Markdown"
                title="Test Markdown rendering"
              >
                <span className="text-xs text-gray-500">T</span>
              </button>
              <button
                onClick={clearChatHistory}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                <ChevronUp size={16} className="text-gray-500" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`
                    max-w-[80%] px-4 py-2 rounded-lg text-sm
                    ${msg.sender === 'user' 
                      ? 'bg-danier-800 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }
                  `}
                >
                  {msg.sender === 'bot' ? (
                    <div className="whitespace-pre-wrap">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="break-words mb-2" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2" {...props} />,
                          a: ({ node, ...props }) => (
                            <a 
                              {...props} 
                              className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            />
                          ),
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-1" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                          table: ({ node, ...props }) => <table className="border-collapse border border-gray-300 mb-2 text-xs" {...props} />,
                          th: ({ node, ...props }) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 text-left font-bold" {...props} />,
                          td: ({ node, ...props }) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                          pre: ({ node, ...props }) => <pre className="bg-gray-200 p-2 rounded overflow-x-auto text-xs my-2" {...props} />,
                          img: ({ node, ...props }) => <img className="max-w-full h-auto rounded my-2" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="break-words">{msg.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-danier-200' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
                          ))}
            
            {/* Product Results Dropdown within chat */}
            {showDropdown && dropdownProducts.length > 0 && (
              <div className="flex justify-start mt-2">
                <div className="max-w-full w-full">
                  <ProductResultsDropdown
                    products={dropdownProducts}
                    total={dropdownTotal}
                    searchQuery={dropdownSearchQuery}
                    onClose={() => {
                      setShowDropdown(false);
                      setDropdownProducts([]);
                      setDropdownTotal(0);
                      setDropdownSearchQuery('');
                    }}
                  />
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-md px-4 py-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-danier-800"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg relative">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search our leather goods..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-danier-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 bg-danier-800 text-white rounded-lg hover:bg-danier-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 