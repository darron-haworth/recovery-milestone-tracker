# 🚀 Production Deployment Guide

This guide covers deploying your Recovery Milestone Tracker backend to production.

## 📋 Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project: `recovery-milestone-tracker`
- Node.js 20+ installed
- Git repository with your code

## 🔧 Deployment Options

### Option 1: Firebase Functions (Recommended)

**Pros:**
- ✅ Fully integrated with Firebase
- ✅ Automatic scaling
- ✅ Pay-per-use pricing
- ✅ Built-in security
- ✅ Easy to deploy and manage

**Deploy Steps:**

1. **Install dependencies:**
   ```bash
   cd functions
   npm install
   ```

2. **Build the functions:**
   ```bash
   npm run build
   ```

3. **Deploy to Firebase:**
   ```bash
   ./deploy-backend-production.sh
   ```

4. **Test the deployment:**
   ```bash
   curl https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/health
   ```

### Option 2: Vercel (Alternative)

**Pros:**
- ✅ Easy deployment
- ✅ Great performance
- ✅ Free tier available
- ✅ Automatic HTTPS

**Deploy Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "backend/server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 3: Railway (Alternative)

**Pros:**
- ✅ Simple deployment
- ✅ Automatic deployments from Git
- ✅ Built-in monitoring
- ✅ Reasonable pricing

**Deploy Steps:**

1. **Connect GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on git push**

## 🔐 Environment Variables

### Required for Production:

```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=recovery-milestone-tracker
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### Optional (with defaults):

```bash
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
LOG_LEVEL=info
```

## 🛡️ Security Checklist

- [ ] Firebase service account key is secure
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] Input validation is in place
- [ ] Error handling doesn't leak sensitive info
- [ ] HTTPS is enforced
- [ ] API keys are not exposed in client code

## 📱 Mobile App Configuration

After deploying, update your mobile app:

1. **Update API URL** (already done in `api.ts`):
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://10.0.2.2:3000'  // Development
     : 'https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api'; // Production
   ```

2. **Test the connection:**
   ```bash
   curl https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/health
   ```

## 🔍 Monitoring & Logs

### Firebase Functions:
- **Logs:** `firebase functions:log`
- **Console:** https://console.firebase.google.com/project/recovery-milestone-tracker/functions

### Health Checks:
- **Endpoint:** `GET /health`
- **Expected Response:**
  ```json
  {
    "status": "OK",
    "timestamp": "2025-09-06T20:00:00.000Z",
    "uptime": 123.456,
    "environment": "production",
    "version": "1.0.0"
  }
  ```

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check CORS origins in functions/src/index.ts
   - Ensure your domain is in the allowed origins list

2. **Authentication Errors:**
   - Verify Firebase service account key is correct
   - Check Firebase project ID matches

3. **Rate Limiting:**
   - Adjust rate limits in functions/src/index.ts
   - Check if you're hitting the limits

4. **Cold Starts:**
   - Firebase Functions may have cold start delays
   - Consider using Firebase Functions Gen 2 for better performance

## 📊 Performance Optimization

1. **Enable compression** (already enabled)
2. **Use connection pooling** for database
3. **Implement caching** for frequently accessed data
4. **Monitor memory usage** and optimize accordingly
5. **Use Firebase Functions Gen 2** for better performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example:

```yaml
name: Deploy to Firebase Functions

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install -g firebase-tools
      - run: cd functions && npm install
      - run: cd functions && npm run build
      - run: firebase deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 📈 Scaling Considerations

- **Firebase Functions:** Auto-scales based on demand
- **Database:** Firestore scales automatically
- **Storage:** Firebase Storage scales automatically
- **Monitoring:** Use Firebase Performance Monitoring

## 🎯 Next Steps

1. Deploy using the script: `./deploy-backend-production.sh`
2. Test all endpoints
3. Update mobile app to use production URL
4. Set up monitoring and alerts
5. Configure custom domain (optional)
6. Set up CI/CD pipeline
7. Monitor performance and optimize

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Verify environment variables
3. Test endpoints individually
4. Check CORS configuration
5. Review security settings
