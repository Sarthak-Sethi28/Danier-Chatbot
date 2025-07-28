# Danier Chatbot Server

Express server with OpenAI integration for the Danier chat widget. This server provides a REST API that connects the frontend chat widget to OpenAI's GPT-4 for intelligent customer service responses.

## Features

- **Express.js Server**: Fast, unopinionated web framework
- **OpenAI Integration**: GPT-4 powered chat responses
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Secure API key management
- **Error Handling**: Comprehensive error handling and validation
- **Health Check**: Server status monitoring endpoint
- **Danier Context**: Pre-configured with Danier product information

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Chat Endpoint
```
POST /api/chat
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, I'm looking for a leather jacket"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "role": "assistant",
    "content": "Hello! I'd be happy to help you find the perfect leather jacket. We have some excellent options in our current collection..."
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  },
  "model": "gpt-4"
}
```

## Error Handling

The server includes comprehensive error handling:

- **400 Bad Request**: Invalid request body or message structure
- **401 Unauthorized**: Invalid OpenAI API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server or OpenAI API errors

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## Danier Product Context

The server is pre-configured with Danier product information:

### Current Products (Spring 2025)
- **Leather Jackets**: Monaco Reversible Jacket ($449.00, was $797.00), Monaco Blazer ($577.00)
- **Handbags**: Mariam Small Satchel ($199.00), Mariam Large Satchel ($229.00), Edith Crossbody ($199.00), Edith Satchel ($249.00), Willowby Camera Bag ($159.00)
- **Laptop Bags**: Eliam Laptop Bag ($349.00), Charly Laptop Bag ($199.00)
- **Colors**: Black, Brown, Saddle, White

### AI Guidelines
- Friendly, professional customer service
- Accurate product information and pricing
- Sale price highlighting
- Product recommendations
- Concise but informative responses

## Testing the API

### Using curl
```bash
# Health check
curl http://localhost:3000/api/health

# Chat request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What leather jackets do you have?"
      }
    ]
  }'
```

### Using Postman
1. Create a new POST request to `http://localhost:3000/api/chat`
2. Set Content-Type header to `application/json`
3. Add request body:
   ```json
   {
     "messages": [
       {
         "role": "user",
         "content": "Show me your handbags"
       }
     ]
   }
   ```

## Security Considerations

- **API Key Security**: Never commit your `.env` file to version control
- **CORS Configuration**: Configure appropriate CORS origins for production
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Input Validation**: All inputs are validated before processing

## Production Deployment

1. **Set environment variables:**
   ```env
   NODE_ENV=production
   OPENAI_API_KEY=your_production_api_key
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Use a process manager like PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "danier-chatbot"
   ```

3. **Set up reverse proxy (nginx recommended)**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check your `.env` file
   - Ensure the API key is valid

2. **CORS errors**
   - Verify `CORS_ORIGIN` in your `.env` file
   - Check that your frontend URL matches

3. **Rate limit errors**
   - Check your OpenAI API usage
   - Consider upgrading your OpenAI plan

4. **Port already in use**
   - Change the `PORT` in your `.env` file
   - Or kill the process using the port

## Support

For issues related to:
- **Server setup**: Check this README and Node.js documentation
- **OpenAI API**: Refer to OpenAI's API documentation
- **Danier products**: Contact Danier customer service

## License

This project is created for Danier's use and customization. 