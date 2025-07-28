import React from 'react';
import './index.css';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Danier Chatbot - HYBRID SYSTEM
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            ✅ FAQ Questions (bulletproof) + 🛍️ Product Search (working together!)
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="font-semibold text-green-600 mb-3">✅ FAQ System (Bulletproof)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "What is your return policy?"</li>
                  <li>• "How do I exchange items?"</li>
                  <li>• "Shipping information"</li>
                  <li>• "Store locations"</li>
                  <li>• "Size guide"</li>
                  <li>• "Care instructions"</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-600 mb-3">🛍️ Product Search (With Dropdown)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Black handbags for women"</li>
                  <li>• "Leather jackets"</li>
                  <li>• "Men's laptop bags"</li>
                  <li>• "Travel bags under $300"</li>
                  <li>• "Women's belts"</li>
                  <li>• Any product category!</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <p className="text-gray-800 text-sm text-center">
                🎯 <strong>HYBRID SYSTEM:</strong> FAQ answers instantly (no server) + Product searches show dropdown!<br/>
                💬 <strong>Click the chat button in the bottom-right corner to test both!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* HYBRID ChatWidget - FAQ (bulletproof) + Product Search (with dropdown) */}
      <ChatWidget />
    </div>
  );
}

export default App; 