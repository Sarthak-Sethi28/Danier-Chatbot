import React, { useState, useEffect, useRef } from 'react';

// COMPLETE FAQ DATABASE - NO SERVER DEPENDENCIES
const FAQ_DATABASE = {
  "return policy": {
    category: "Returns & Exchanges",
    answer: `RETURN POLICY: Our policy for returns and exchanges is as follows:

• Regular and Sale-Priced Items: Eligible for return or size exchange within 10 days from the delivery date.
• Prepaid Return Label: A one-time prepaid return label is available for size exchange or online store credit for domestic orders only.
• Refunds: Customers requesting a refund are responsible for the return shipping costs.
• Clearance Items: Items ending with $0.88 or $0.99 are final sale and are not eligible for return.

Please use the link provided to apply for your return or size exchange: https://danier.com/a/returns

For size exchanges or online store credit on regular and sale-priced items totaling $100 before tax, we provide a prepaid return label. However, please note that customers requesting a refund are responsible for the return shipping costs.`
  },
  "exchange": {
    category: "Returns & Exchanges", 
    answer: `EXCHANGE PROCESS: To exchange your items:

• Items must be returned within 10 days of delivery
• Items must be in original condition with tags attached
• Use our online return portal: https://danier.com/a/returns
• Select "Exchange" option during the return process
• For size exchanges on orders $100+, we provide a prepaid return label
• Processing time: 5-7 business days after we receive your item

EXCHANGE LOCATIONS: You can also exchange items at any Danier retail location with your receipt.`
  },
  "damaged items": {
    category: "Returns & Exchanges",
    answer: `DAMAGED ITEMS: If you received damaged items:

• Contact us immediately with photos of the damage
• We'll provide a prepaid return label at no cost to you
• Full refund or replacement will be provided
• No questions asked for manufacturing defects
• Email us at customer service with your order number and photos

We stand behind the quality of our products and will make it right.`
  },
  "shipping": {
    category: "Shipping & Delivery",
    answer: `SHIPPING INFORMATION:

• Standard Shipping: 5-7 business days ($10 CAD)
• Express Shipping: 2-3 business days ($20 CAD)
• Free shipping on orders over $150 CAD
• Same-day delivery available in Toronto and Vancouver
• International shipping available to select countries

TRACKING: You'll receive a tracking number via email once your order ships.`
  },
  "store locations": {
    category: "Store Information",
    answer: `DANIER STORE LOCATIONS:

TORONTO LOCATIONS:
• Yorkdale Shopping Centre
• Eaton Centre
• Sherway Gardens

VANCOUVER LOCATIONS:
• Pacific Centre
• Metrotown

MONTREAL LOCATIONS:
• Place Sainte-Foy
• Carrefour Laval

Store hours: Monday-Saturday 10am-9pm, Sunday 11am-7pm
Find specific store details at: danier.com/pages/store-locator`
  },
  "size guide": {
    category: "Sizing & Fit",
    answer: `SIZING GUIDE:

LEATHER JACKETS:
• XS: 32-34" chest
• S: 36-38" chest  
• M: 40-42" chest
• L: 44-46" chest
• XL: 48-50" chest

BELT SIZING:
• Measure your waist where you normally wear your belt
• Add 2 inches to your waist measurement for proper fit
• Our belts have 5 adjustment holes for flexibility

For specific measurements, visit: danier.com/pages/size-guide`
  },
  "care instructions": {
    category: "Product Care",
    answer: `LEATHER CARE INSTRUCTIONS:

CLEANING:
• Use only leather-specific cleaners
• Test on hidden area first
• Apply with soft, damp cloth
• Allow to air dry completely

STORAGE:
• Store in cool, dry place
• Use padded hangers for jackets
• Avoid plastic bags - use breathable garment bags
• Keep away from direct sunlight

MAINTENANCE:
• Condition leather 2-3 times per year
• Use our recommended leather care products available in-store`
  }
};

// FAQ DETECTION PATTERNS
const FAQ_PATTERNS = [
  { pattern: /return\s*policy|returns/i, key: "return policy" },
  { pattern: /exchange|swap|size\s*change/i, key: "exchange" },
  { pattern: /damaged|defect|broken|quality/i, key: "damaged items" },
  { pattern: /shipping|delivery|tracking/i, key: "shipping" },
  { pattern: /store|location|address|hours/i, key: "store locations" },
  { pattern: /size|sizing|measurements|fit/i, key: "size guide" },
  { pattern: /care|clean|maintain|condition|storage/i, key: "care instructions" }
];

const StandaloneFAQWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your Danier FAQ assistant. Ask me about returns, exchanges, shipping, sizing, or care instructions!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectFAQ = (query) => {
    const lowerQuery = query.toLowerCase();
    
    for (const { pattern, key } of FAQ_PATTERNS) {
      if (pattern.test(lowerQuery)) {
        return FAQ_DATABASE[key];
      }
    }
    
    return null;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Detect FAQ response
    const faqResponse = detectFAQ(inputValue);
    
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: faqResponse ? faqResponse.answer : "I'm here to help with questions about returns, exchanges, shipping, sizing, and care instructions. Could you please rephrase your question or ask about one of these topics?",
        isUser: false,
        timestamp: new Date(),
        category: faqResponse?.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 flex items-center justify-center text-2xl ${isOpen ? 'hidden' : 'block'}`}
      >
        💬
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Danier FAQ Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.text}</div>
                  {message.category && (
                    <div className="text-xs mt-1 opacity-70">
                      📂 {message.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about returns, exchanges, etc..."
                className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                ➤
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              ✅ Standalone FAQ • No server required • Always available
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StandaloneFAQWidget; 