# 🚀 Deployment Configuration Guide

## 📱 Mobile App Deployment

### Android Release Build
```bash
# Build Android APK
npm run build:android:release

# The APK will be generated at:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS Release Build
```bash
# Build iOS Archive
npm run build:ios:release

# The archive will be generated at:
# ios/RecoveryMilestoneTracker.xcarchive
```

## 🌐 Backend Deployment

### Environment Variables for Production
```bash
# Create production .env
NODE_ENV=production
PORT=3000
FIREBASE_PROJECT_ID=recovery-milestone-tracker
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
USE_FIRESTORE=true

# Security (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secure-jwt-secret-here
ENCRYPTION_KEY=your-super-secure-encryption-key-here

# CORS (Update with your production domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting (Adjust for production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Production Server Setup
```bash
# Install PM2 for process management
npm install -g pm2

# Start production server
pm2 start server.js --name "recovery-tracker-api"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🔒 Security Checklist

### Firebase Security Rules
- [ ] Update Firestore security rules
- [ ] Update Storage security rules
- [ ] Enable Firebase App Check
- [ ] Configure authentication providers

### API Security
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Add request validation

### Mobile App Security
- [ ] Enable code obfuscation
- [ ] Configure ProGuard rules
- [ ] Enable certificate pinning
- [ ] Secure API endpoints

## 📊 Monitoring & Analytics

### Backend Monitoring
```bash
# Install monitoring tools
npm install --save winston morgan

# Setup logging
# Setup health checks
# Setup performance monitoring
```

### Mobile App Analytics
- [ ] Enable Firebase Analytics
- [ ] Setup crash reporting
- [ ] Monitor app performance
- [ ] Track user engagement

## 🧪 Testing Checklist

### Backend Testing
- [ ] Unit tests for all routes
- [ ] Integration tests
- [ ] Load testing
- [ ] Security testing

### Mobile App Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Device testing

## 🚀 Deployment Steps

### 1. Pre-deployment
- [ ] Run all tests
- [ ] Update version numbers
- [ ] Check security settings
- [ ] Backup production data

### 2. Backend Deployment
- [ ] Deploy to production server
- [ ] Update environment variables
- [ ] Restart services
- [ ] Verify health checks

### 3. Mobile App Deployment
- [ ] Build release versions
- [ ] Test on devices
- [ ] Upload to app stores
- [ ] Monitor for issues

### 4. Post-deployment
- [ ] Monitor logs
- [ ] Check performance
- [ ] Verify functionality
- [ ] User feedback collection

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] Security rules updated
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring tools active
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] User analytics enabled
- [ ] Support system ready
- [ ] Documentation updated







