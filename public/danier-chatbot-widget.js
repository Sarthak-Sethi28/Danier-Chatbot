// Danier Chatbot Widget - Embed Script
// Add this script to any website to include the Danier chatbot

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    apiUrl: 'https://your-backend-url.railway.app', // Will be updated after deployment
    widgetId: 'danier-chatbot-widget',
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'light', // light, dark
    language: 'en'
  };
  
  // Create widget container
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = CONFIG.widgetId;
    widget.style.cssText = `
      position: fixed;
      ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Add iframe for the chatbot
    const iframe = document.createElement('iframe');
    iframe.src = 'https://your-frontend-url.vercel.app'; // Will be updated after deployment
    iframe.style.cssText = `
      width: 400px;
      height: 600px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      background: white;
    `;
    
    widget.appendChild(iframe);
    document.body.appendChild(widget);
    
    return widget;
  }
  
  // Initialize widget
  function init() {
    if (document.getElementById(CONFIG.widgetId)) {
      return; // Already loaded
    }
    
    const widget = createWidget();
    
    // Add toggle functionality
    let isVisible = true;
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '💬';
    toggleButton.style.cssText = `
      position: fixed;
      ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 10000;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: #1a1a1a;
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    
    toggleButton.addEventListener('click', function() {
      isVisible = !isVisible;
      widget.style.display = isVisible ? 'block' : 'none';
      toggleButton.innerHTML = isVisible ? '💬' : '💬';
    });
    
    document.body.appendChild(toggleButton);
  }
  
  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose configuration for customization
  window.DanierChatbotConfig = CONFIG;
  
})(); 