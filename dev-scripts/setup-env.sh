#!/bin/bash

# Firebase Environment Setup Script
echo "🔥 Setting up Firebase environment variables..."

# Create .env file with Firebase configuration
cat > .env << 'EOF'
# Environment Configuration
NODE_ENV=development
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=recovery-milestone-tracker
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
USE_FIRESTORE=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:19006

# Security
JWT_SECRET=dev-jwt-secret-change-in-production
ENCRYPTION_KEY=dev-encryption-key-change-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
APP_NAME=Recovery Milestone Tracker
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@recoverymilestonetracker.com
EOF

echo "✅ .env file created successfully!"
echo "📝 Firebase configuration:"
echo "   Project ID: recovery-milestone-tracker"
echo "   Storage Bucket: recovery-milestone-tracker.firebasestorage.app"
echo "   Using Firestore: true"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: export GOOGLE_APPLICATION_CREDENTIALS=\"/home/darron/firebase-keys/recovery-milestone-tracker-firebase-adminsdk-fbsvc-b5a53edc5c.json\""
echo "   2. Run: npm run dev"
echo "   3. Test: curl http://localhost:3000/api/health"







