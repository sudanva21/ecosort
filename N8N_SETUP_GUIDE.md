# N8N Webhook Setup Guide

## Overview
This project requires two n8n workflows for waste classification and disposal guidance. Both features are now properly configured to use real n8n webhooks instead of mock data.

## Configuration Status
✅ **Environment Variables**: Added to `.env` file  
✅ **API Integration**: Updated to use `import.meta.env` variables  
✅ **Mock Data**: Removed from both features  
✅ **Error Handling**: Proper error messages for missing webhooks  

---

## Setup Steps

### 1. Import n8n Workflows

Two workflow JSON files are included in the project root:
- `n8n-waste-classification-workflow.json` - For classify waste feature
- `n8n-disposal-guide-workflow.json` - For disposal guide feature

**Import these workflows into your n8n instance:**
1. Log into your n8n instance
2. Click on **Workflows** > **Import from File**
3. Import both JSON files
4. Activate each workflow

### 2. Get Webhook URLs

After importing and activating the workflows:

**For Waste Classification:**
1. Open the "Waste Classification" workflow
2. Click on the **Webhook** node
3. Copy the **Production URL** (e.g., `https://your-n8n-instance.app.n8n.cloud/webhook/classify-waste`)

**For Disposal Guide:**
1. Open the "Disposal Guide" workflow
2. Click on the **Webhook** node
3. Copy the **Production URL** (e.g., `https://your-n8n-instance.app.n8n.cloud/webhook/disposal-guide`)

### 3. Update Environment Variables

✅ **Already Configured!** Your `.env` file is set up with:

```env
VITE_N8N_CLASSIFY_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/classify-waste
VITE_N8N_GUIDE_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/disposal-guide
```

**Important**: Make sure these workflows are imported and activated on your Render n8n instance.

### 4. Restart Development Server

After updating the `.env` file:
```bash
npm run dev
```

---

## Expected API Responses

### Classify Waste API Response Format
The n8n webhook should return JSON in this format:
```json
{
  "category": "Recyclable" | "Wet" | "Dry",
  "confidence": 92,
  "description": "Plastic bottle detected - can be recycled"
}
```

### Disposal Guide API Response Format
The n8n webhook should return JSON in this format:
```json
{
  "category": "Recyclable",
  "description": "Items that can be processed and reused",
  "icon": "recycle",
  "color": "#2ECC71",
  "tips": [
    "Clean and dry items before recycling",
    "Remove caps and labels when possible",
    "Check local recycling guidelines"
  ],
  "examples": [
    "Plastic bottles",
    "Glass containers",
    "Metal cans"
  ]
}
```

---

## Testing

### Test Classify Feature
1. Navigate to `/classify` page
2. Upload an image of waste
3. Click "Classify Waste"
4. Verify the response shows:
   - Category (Recyclable/Wet/Dry)
   - Confidence percentage
   - Description text

### Test Guide Feature
1. Navigate to `/guide` page
2. Select a category tab (Recyclable/Wet/Dry)
3. Verify the guide shows:
   - Category description
   - Disposal tips
   - Example items
   - Color-coded icon

---

## Troubleshooting

### Error: "Failed to classify waste. Please check your n8n webhook configuration."
- **Cause**: Webhook URL is not set or incorrect
- **Fix**: Verify `VITE_N8N_CLASSIFY_WEBHOOK` in `.env` file
- **Check**: Ensure n8n workflow is activated

### Error: "Failed to fetch disposal guide. Please check your n8n webhook configuration."
- **Cause**: Webhook URL is not set or incorrect
- **Fix**: Verify `VITE_N8N_GUIDE_WEBHOOK` in `.env` file
- **Check**: Ensure n8n workflow is activated

### CORS Errors
If you see CORS errors in the browser console:
1. Check n8n webhook settings
2. Ensure "Allow Origin" is set correctly
3. May need to configure CORS in n8n workflow settings

### Webhook Not Responding
1. Verify workflow is **activated** in n8n (toggle must be ON)
2. Check n8n workflow execution history for errors
3. Test webhook directly using Postman or curl
4. Verify webhook URL format is correct

---

## Development vs Production

### Development
- Use n8n Cloud test webhooks
- URLs will contain `.app.n8n.cloud`

### Production
- Use production n8n instance
- Update environment variables in production deployment
- Ensure webhooks are secured (consider authentication)

---

## Security Considerations

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use different webhooks** for dev/staging/production
3. **Monitor webhook usage** in n8n dashboard
4. **Consider rate limiting** for production webhooks
5. **Add authentication** to webhooks if handling sensitive data

---

## Quick Reference

| Feature | Endpoint | Method | Content-Type |
|---------|----------|--------|--------------|
| Classify Waste | `/webhook/classify-waste` | POST | `multipart/form-data` |
| Disposal Guide | `/webhook/disposal-guide` | POST | `application/json` |

---

## Need Help?

- Check n8n workflow execution logs
- Review network tab in browser DevTools
- Verify `.env` variables are loaded correctly
- Ensure development server was restarted after changing `.env`
