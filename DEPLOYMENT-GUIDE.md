# 🚀 Danier Chatbot Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Vercel Account** (for frontend hosting)
3. **Railway Account** (for backend hosting)
4. **OpenAI API Key** (for chat functionality)

## 🎯 Deployment Steps

### Step 1: Prepare Your Code

✅ **Code is ready!** The following files have been prepared:
- `vercel.json` - Vercel configuration
- `server/railway.json` - Railway configuration  
- `server/Procfile` - Alternative hosting support
- `public/danier-chatbot-widget.js` - Embed widget script
- `public/integration-example.html` - Integration example

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to server folder
   cd server
   
   # Deploy to Railway
   railway up
   ```

3. **Set Environment Variables in Railway Dashboard**
   - `OPENAI_API_KEY` = Your OpenAI API key
   - `CORS_ORIGIN` = Your frontend URL (will be set after Vercel deployment)
   - `NODE_ENV` = production

4. **Get Your Backend URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - Save this URL for the next step

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Go back to project root
   cd ..
   
   # Create .env file with backend URL
   echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Get Your Frontend URL**
   - Vercel will provide a URL like: `https://your-app-name.vercel.app`
   - Save this URL

### Step 4: Update Configuration

1. **Update Backend CORS Settings**
   - Go to Railway dashboard
   - Add your frontend URL to `CORS_ORIGIN` environment variable

2. **Update Widget Script**
   - Edit `public/danier-chatbot-widget.js`
   - Replace `your-backend-url.railway.app` with your actual Railway URL
   - Replace `your-frontend-url.vercel.app` with your actual Vercel URL

3. **Redeploy Frontend**
   ```bash
   vercel --prod
   ```

### Step 5: Test Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Test chatbot functionality

3. **Test Widget Integration**
   - Open `public/integration-example.html` in browser
   - Verify widget appears and works

## 🔧 Integration with Main Website

### Option 1: Simple Script Tag
Add this to your main website's HTML:

```html
<script>
window.DanierChatbotConfig = {
    position: 'bottom-right',
    theme: 'light'
};
</script>
<script src="https://your-frontend-url.vercel.app/danier-chatbot-widget.js"></script>
```

### Option 2: Custom Integration
For more control, you can:
- Host the widget script on your own domain
- Customize the styling and positioning
- Add analytics and tracking

## 📊 Monitoring & Maintenance

### Railway Backend Monitoring
- Check Railway dashboard for logs
- Monitor API response times
- Set up alerts for errors

### Vercel Frontend Monitoring
- Check Vercel dashboard for analytics
- Monitor page load times
- Review error logs

### Performance Optimization
- The chatbot loads 17,421 products efficiently
- Product search is optimized for speed
- Images are served from Shopify CDN

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` includes your frontend URL
   - Check that URLs are exact matches

2. **API Connection Issues**
   - Verify backend URL is correct
   - Check Railway deployment status
   - Test with curl: `curl https://your-backend-url.railway.app/api/health`

3. **Widget Not Loading**
   - Check browser console for errors
   - Verify widget script URL is accessible
   - Ensure no JavaScript conflicts

4. **Product Search Not Working**
   - Check backend logs for errors
   - Verify product data is loaded
   - Test with simple queries first

### Support
- Check Railway and Vercel documentation
- Review browser console for errors
- Test with different browsers and devices

## 🎉 Success Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Widget script updated with correct URLs
- [ ] Health check passes
- [ ] Chatbot functionality tested
- [ ] Widget integration tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized

## 💰 Cost Estimation

### Railway (Backend)
- **Free Tier**: $5/month credit
- **Usage**: ~$2-5/month for moderate traffic
- **Scaling**: Pay per usage

### Vercel (Frontend)
- **Free Tier**: Unlimited deployments
- **Bandwidth**: 100GB/month free
- **Scaling**: Pay per usage

**Total Estimated Cost**: $5-10/month for moderate usage

---

**Ready to deploy? Start with Step 2 (Railway backend deployment)!** 🚀 