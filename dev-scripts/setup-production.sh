#!/bin/bash

# Production Environment Setup Script
echo "🚀 Setting up production environment..."

# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Create production .env file
cat > .env.production << EOF
# Production Environment Configuration
# ⚠️  IMPORTANT: Change all secrets and keys before deploying!

NODE_ENV=production
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=recovery-milestone-tracker
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
USE_FIRESTORE=true

# Security (Generated secure keys)
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# CORS Configuration (Update with your production domains)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting (Production settings)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# App Configuration
APP_NAME=Recovery Milestone Tracker
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@recoverymilestonetracker.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Performance
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
CACHE_TTL=3600

# Monitoring
ENABLE_HEALTH_CHECKS=true
HEALTH_CHECK_INTERVAL=30000
ENABLE_METRICS=true
EOF

echo "✅ Production .env file created!"
echo "🔑 Generated secure JWT_SECRET and ENCRYPTION_KEY"
echo ""
echo "📝 Next steps:"
echo "   1. Update ALLOWED_ORIGINS with your production domains"
echo "   2. Review and customize other settings as needed"
echo "   3. Install PM2: npm install -g pm2"
echo "   4. Start production server: pm2 start server.js --name 'recovery-tracker-api'"
echo "   5. Save PM2 config: pm2 save"
echo "   6. Setup auto-start: pm2 startup"
echo ""
echo "⚠️  IMPORTANT: Keep your .env.production file secure and never commit it to version control!"







