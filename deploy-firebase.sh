#!/bin/bash

# Firebase Deployment Script for Recovery Milestone Tracker
# This script sets up and deploys Firebase services

set -e

echo "🚀 Firebase Deployment Script for Recovery Milestone Tracker"
echo "=========================================================="

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

# Initialize Firebase project if not already done
if [ ! -f "firebase.json" ]; then
    echo "❌ Firebase project not initialized. Please run: firebase init"
    echo "   Select: Firestore, Storage, and Functions"
    echo "   Use existing project: recovery-milestone-tracker"
    exit 1
fi

echo ""
echo "🔧 Deploying Firebase services..."

# Deploy Firestore rules
echo "📋 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Deploy Firestore indexes
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

# Deploy Storage rules
echo "🗄️ Deploying Storage rules..."
firebase deploy --only storage

echo ""
echo "✅ Firebase deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Your Firestore database is now ready"
echo "   2. User profiles will be automatically saved to the cloud"
echo "   3. Sobriety dates are now persisted across devices"
echo "   4. Data is secured with authentication-based rules"
echo ""
echo "🔍 You can view your Firestore database at:"
echo "   https://console.firebase.google.com/project/recovery-milestone-tracker/firestore"
echo ""
echo "🛡️ Security rules are active and users can only access their own data"


