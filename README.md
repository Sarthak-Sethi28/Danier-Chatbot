# Danier Chat Widget

A modern, responsive chat widget component built with React and TailwindCSS for Danier's Shopify website, featuring dynamic product data integration and OpenAI-powered intelligent responses.

## Features

- **Fixed Positioning**: Circular chat button positioned in the bottom-right corner
- **Toggle Functionality**: Click to open/close the chat panel
- **Responsive Design**: Panel adapts to viewport size (50% width, 70% height with max constraints)
- **Modern UI**: Clean design with Danier brand colors and smooth animations
- **Message History**: Scrollable message area with timestamps and persistent storage
- **Markdown Rendering**: Rich text formatting for bot responses with styled links, lists, and formatting
- **Product Links**: Direct links to Danier product pages for easy shopping
- **Chat Persistence**: Conversation history saved to localStorage and restored on page reload
- **Full Conversation Context**: Complete message history sent to backend for context-aware responses
- **Persistent Filter State**: User preferences (price, color, category, gender) remembered across messages
- **Smart Filter Parsing**: Automatic extraction of filters from natural language queries
- **Progressive Refinement**: Users can refine searches without repeating information
- **Conditional Prompting**: Only asks for missing essential information
- **Loading States**: Visual feedback during API calls
- **Keyboard Support**: Enter key to send messages
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Dynamic Product Data**: Real-time product information with season filtering
- **Smart Search**: Advanced product search and filtering capabilities
- **OpenAI Integration**: GPT-4 powered intelligent responses via Express server

## Product Data Integration

The chat widget uses a comprehensive product database with automatic season filtering:

### Season Codes
- **SP25**: Spring 2025 (March - August)
- **FA25**: Fall 2025 (September - February)

The system automatically shows only products from the current season based on the current date.

### Excel Data Integration

To integrate your `Book3.xlsx` data:

#### Option 1: Automated Conversion
1. Export `Book3.xlsx` as CSV
2. Use the conversion script in `scripts/convertExcelData.js`
3. Replace the `DANIER_PRODUCTS` array in `src/data/danierProducts.js`

#### Option 2: Manual Conversion
1. Open `Book3.xlsx` in Excel
2. For each product, create an object with these fields:
   ```javascript
   {
     id: 1,
     name: "Product Name",
     category: PRODUCT_CATEGORIES.JACKETS, // or other categories
     price: 577.00,
     currency: "CAD",
     colors: ["BLACK", "BROWN"],
     season: "SP25", // or "FA25"
     description: "Product description",
     image: "image-filename.jpg"
   }
   ```

#### Required Fields
- **id**: Unique identifier
- **name**: Product name
- **category**: One of the predefined categories
- **price**: Numeric price (no currency symbol)
- **currency**: "CAD"
- **colors**: Array of color strings
- **season**: "SP25" or "FA25"
- **description**: Product description
- **image**: Image filename (optional)

#### Product Categories
- `JACKETS`: Leather jackets
- `HANDBAGS`: Handbags and purses
- `LAPTOP_BAGS`: Professional laptop bags
- `TRAVEL`: Travel bags and luggage
- `ACCESSORIES`: General accessories
- `SHOES`: Footwear
- `WALLETS`: Wallets and card holders
- `GLOVES`: Gloves and mittens

## Component Structure

```
ChatWidget/
├── Fixed circular button (bottom-right)
├── Chat panel (when open)
│   ├── Header with "Chat with Us" title and close button
│   ├── Scrollable messages area
│   └── Footer with input field and send button
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### Basic Implementation

```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatWidget />
    </div>
  );
}
```

### Advanced Features

The chat widget now includes:

- **Product Search**: Users can search for specific products
- **Price Filtering**: "Under $300", "Over $200", "Between $150-$400"
- **Category Filtering**: Jackets, handbags, laptop bags, etc.
- **Color Filtering**: Black, brown, white, saddle options
- **Season Awareness**: Automatically shows current season products
- **Dynamic Pricing**: Real-time price range information

### Example User Queries
- "Show me leather jackets"
- "Handbags under $250"
- "Black laptop bags"
- "What colors do you have?"
- "Spring collection"
- "Professional bags"

## Customization

The component uses TailwindCSS classes and can be customized by modifying:

- **Colors**: Update the `danier` color palette in `tailwind.config.js`
- **Sizing**: Modify the panel dimensions in the component (currently `w-[50vw] h-[70vh]`)
- **Positioning**: Change the fixed positioning classes on the main container
- **Styling**: Update Tailwind classes for colors, spacing, and shadows
- **Product Data**: Modify `src/data/danierProducts.js` for different products

## Styling

The component uses a custom Danier color palette:

- `danier-50` to `danier-900`: Gray scale with brand colors
- Custom shadows: `chat-widget-shadow` and `chat-button-shadow`
- Responsive breakpoints for mobile optimization

## Dependencies

- React 18.2.0
- TailwindCSS 3.3.0
- Lucide React (for icons)
- React Scripts (for development)
- React Markdown (for rich text rendering)
- Express (backend server)
- OpenAI API (GPT-4 integration)
- CORS (cross-origin requests)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing New Features

### Context-Aware Chat Test
Click the "F" button in the chat header to see current filter state, then try these scenarios:

#### Scenario 1: Multi-Filter Query
```
User: "Show me red coats for women under $500"
Expected: Returns filtered results without asking for price or color again
```

#### Scenario 2: Filter Refinement
```
User: "Show me red coats for women under $500"
Bot: [Shows results]
User: "Actually, make it 250-500"
Expected: Updates price range, shows new results, doesn't ask for color/category again
```

#### Scenario 3: Progressive Filter Addition
```
User: "I want a leather jacket"
Bot: [Shows jackets]
User: "In black"
Bot: [Shows black jackets]
User: "Under $600"
Expected: Progressively adds filters without repeating questions
```

### Markdown Rendering Test
Click the "T" button in the chat header to test Markdown rendering with:
- Bold and italic text
- Styled links
- Lists and code blocks
- Various formatting elements

### Chat Persistence Test
1. Send a few messages in the chat
2. Refresh the page
3. Verify that all messages are restored
4. Use the clear chat button (up arrow) to reset the conversation

### Product Search with Links
Try these queries to see formatted product lists with clickable links:
- "Show me leather jackets" - Click product names to view on Danier.com
- "Handbags under $300" - Direct links to product pages
- "What's on sale?" - Browse sale items with links
- "Professional laptop bags" - Category and product links

## Architecture

### Context-Aware System
The chatbot now uses a sophisticated context-aware system with:

1. **FilterParser** (`src/utils/filterParser.js`): Extracts and manages user preferences
   - Price ranges: "under $500", "between $200-$600", "over $150"
   - Colors: black, brown, white, saddle, red, blue, green
   - Categories: jackets, handbags, laptop bags, travel, accessories
   - Gender: women, men, unisex
   - Seasons: spring, fall, summer, winter

2. **ProductSearchService** (`src/utils/productSearchService.js`): Intelligent product recommendations
   - Combines filters for precise searches
   - Generates contextual responses
   - Handles progressive refinement
   - Provides follow-up questions when needed

3. **Full Conversation Context**: Complete message history sent to backend
   - OpenAI receives entire conversation for context-aware responses
   - Backend system prompt emphasizes filter persistence
   - Avoids repetitive questions

### Filter Persistence
- User preferences stored in component state
- Filters persist across messages until explicitly changed
- Automatic filter merging (e.g., "under $500" + "250-500" = "250-500")
- Clear filters when chat is reset

### Smart Response Generation
- **Filter-Aware**: Uses extracted filters for product searches
- **Contextual**: Considers full conversation history
- **Progressive**: Builds on previous responses
- **Conditional**: Only asks for missing essential information

## Development

```
src/
├── components/
│   └── ChatWidget.jsx    # Main chat widget component
├── data/
│   └── danierProducts.js # Product database and helper functions
├── utils/
│   ├── filterParser.js   # Filter extraction and management
│   └── productSearchService.js # Intelligent product search
├── App.jsx               # Main app component
├── index.js              # React entry point
└── index.css             # Global styles and Tailwind imports
server/
├── server.js             # Express server with OpenAI integration
└── package.json          # Backend dependencies
scripts/
├── convertExcelData.js   # Excel data conversion utility
├── shopify-inventory-pipeline.js # Automated data pipeline
├── search-service.js     # Semantic search service
└── scheduler.js          # Automated scheduling
```

## Features in Detail

### Chat Button
- Fixed positioning (`fixed bottom-4 right-4`)
- Circular design with brand colors
- Hover effects and smooth transitions
- Icon changes between chat and close states

### Chat Panel
- Responsive sizing with viewport units
- Maximum constraints for larger screens
- Smooth animations and transitions
- Professional shadow and border styling

### Message System
- Real-time message display
- **Markdown Rendering**: Bot responses support rich text formatting:
  - **Bold text** with `**text**`
  - *Italic text* with `*text*`
  - [Styled links](https://danier.com) with button-like appearance
  - Bullet points and numbered lists
  - Code blocks and inline code
  - Headers and blockquotes
- **Product Links**: 
  - Direct links to Danier product pages
  - Category browse links for easy navigation
  - Full collection browse links
  - Automatic URL generation for all products
- **Chat Persistence**: 
  - All messages automatically saved to localStorage
  - Conversation history restored on page reload
  - Clear chat history button in header
  - Timestamps preserved across sessions
- Auto-scroll to latest messages
- Timestamp formatting
- User/bot message differentiation
- Intelligent product-based responses

### Input System
- Auto-focus when panel opens
- Enter key support for sending
- Disabled state for empty messages
- Placeholder text and proper styling

### Product Intelligence
- Dynamic product search
- Price range filtering
- Category-based responses
- Color availability
- Season-aware filtering

## Integration with Shopify

To integrate this widget with a Shopify store:

1. Build the component: `npm run build`
2. Include the built files in your Shopify theme
3. Add the component to your theme's layout or specific pages
4. Customize the styling to match your theme's design system
5. Update the product data with your actual inventory

## 🚀 Advanced: Shopify Inventory Pipeline

For production use, we've created a comprehensive data pipeline that automatically syncs your Shopify store with the chat widget:

### Pipeline Features
- **Automated Shopify Integration**: Fetches all products via GraphQL Storefront API
- **Inventory Synchronization**: Merges Shopify data with Excel inventory reports
- **AI-Powered Search**: Creates semantic embeddings using OpenAI
- **Vector Database**: Stores embeddings in Pinecone for fast search
- **Scheduled Updates**: Automated pipeline execution with flexible scheduling

### Quick Setup

1. **Install Pipeline Dependencies**:
   ```bash
   cd scripts
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Run Pipeline**:
   ```bash
   # Test the setup
   node test-pipeline.js full
   
   # Run pipeline once
   node shopify-inventory-pipeline.js
   
   # Schedule daily updates
   node scheduler.js daily
   ```

### Pipeline Components

- **`shopify-inventory-pipeline.js`**: Main pipeline that fetches, processes, and embeds data
- **`scheduler.js`**: Automated scheduling with cron jobs
- **`search-service.js`**: Semantic search service for the chat widget
- **`test-pipeline.js`**: Comprehensive testing suite

### Scheduling Options

```bash
# Daily at 2:00 AM (recommended)
node scheduler.js daily

# Every 6 hours
node scheduler.js 6hours

# Every hour
node scheduler.js hourly

# Custom schedule
node scheduler.js custom "0 */4 * * *"
```

For detailed pipeline documentation, see [`scripts/README.md`](scripts/README.md).

## License

This project is created for Danier's use and customization. 