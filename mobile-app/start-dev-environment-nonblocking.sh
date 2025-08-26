#!/bin/bash

# Non-blocking Development Environment Startup Script
# This script starts services in the background without waiting or blocking

echo "🚀 Starting Recovery Milestone Tracker Development Environment (Non-blocking)..."

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
MOBILE_APP_DIR="$PROJECT_ROOT/mobile-app"

echo "📍 Project root: $PROJECT_ROOT"
echo "🔧 Backend directory: $BACKEND_DIR"
echo "📱 Mobile app directory: $MOBILE_APP_DIR"

# Set up Android environment variables
echo "🔧 Setting up Android environment variables..."
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools"
echo "✅ Android environment variables set"

# Start backend server in background (non-blocking)
echo "🔧 Starting backend server on port 3000..."
cd "$BACKEND_DIR"
nohup npm start > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_ROOT/backend.pid"
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Start Metro bundler in background (non-blocking)
echo "📱 Starting Metro bundler on port 8081..."
cd "$MOBILE_APP_DIR"
nohup npx react-native start --reset-cache > "$PROJECT_ROOT/metro.log" 2>&1 &
METRO_PID=$!
echo $METRO_PID > "$PROJECT_ROOT/metro.pid"
echo "✅ Metro bundler started (PID: $METRO_PID)"

echo ""
echo "🎉 Services started in background!"
echo ""
echo "📋 Services running:"
echo "   🔧 Backend Server: http://localhost:3000 (PID: $BACKEND_PID)"
echo "   📱 Metro Bundler: http://localhost:8081 (PID: $METRO_PID)"
echo ""
echo "📱 To run your Android app:"
echo "   cd $MOBILE_APP_DIR && npx react-native run-android"
echo ""
echo "📊 To check service status:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:8081/status"
echo ""
echo "🛑 To stop services:"
echo "   kill $BACKEND_PID $METRO_PID"
echo "   rm -f $PROJECT_ROOT/*.pid"
echo ""
echo "✅ Script completed - chat interface is free!"

