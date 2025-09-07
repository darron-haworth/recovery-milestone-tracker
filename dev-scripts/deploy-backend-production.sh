#!/bin/bash

# Production Backend Deployment Script
# This script deploys the backend to Firebase Functions

set -e

echo "🚀 Deploying Recovery Milestone Tracker Backend to Production"
echo "============================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

# Check if user is logged in
if ! firebase auth:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
else
    echo "✅ Already logged in to Firebase"
fi

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Please run this script from the project root."
    exit 1
fi

echo ""
echo "📦 Installing Firebase Functions dependencies..."

# Install functions dependencies
cd functions
npm install
cd ..

echo ""
echo "🔧 Building Firebase Functions..."

# Build the functions
cd functions
npm run build
cd ..

echo ""
echo "🚀 Deploying to Firebase Functions..."

# Deploy functions
firebase deploy --only functions

echo ""
echo "✅ Backend deployment complete!"
echo ""
echo "🌐 Your API is now available at:"
echo "   https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api"
echo ""
echo "📋 API Endpoints:"
echo "   Health Check: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/health"
echo "   Auth: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/auth/*"
echo "   User: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/user/*"
echo "   Friends: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/friends/*"
echo "   Milestones: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/milestones/*"
echo "   Notifications: https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api/notifications/*"
echo ""
echo "📱 Next steps:"
echo "   1. Update your mobile app's API_BASE_URL to the production URL"
echo "   2. Test the health endpoint to verify deployment"
echo "   3. Update Firebase security rules if needed"
echo ""
echo "🔍 Monitor your functions at:"
echo "   https://console.firebase.google.com/project/recovery-milestone-tracker/functions"
