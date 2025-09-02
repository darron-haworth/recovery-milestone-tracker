#!/bin/bash

# Recovery Milestone Tracker - Restore Working Configuration
# This script restores the development environment to the last known working state

set -e  # Exit on any error

echo "🔄 Restoring Recovery Milestone Tracker to Working Configuration..."
echo "📅 Last Working State: September 2, 2025"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
MOBILE_APP_DIR="$PROJECT_ROOT/mobile-app"

echo "📍 Project root: $PROJECT_ROOT"
echo "🔧 Backend directory: $BACKEND_DIR"
echo "📱 Mobile app directory: $MOBILE_APP_DIR"
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        echo "🛑 Killing existing $service_name on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Step 1: Clean up existing processes
echo "🧹 Cleaning up existing processes..."
kill_port 3000 "Backend Server"
kill_port 8081 "Metro Bundler"
pkill -f metro 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true
echo "✅ Cleanup complete"
echo ""

# Step 2: Verify critical configuration files
echo "🔍 Verifying critical configuration files..."

# Check package name consistency
echo "📦 Checking package name consistency..."
ANDROID_PACKAGE=$(grep "applicationId" "$MOBILE_APP_DIR/android/app/build.gradle" | sed 's/.*"\(.*\)".*/\1/')
FIREBASE_PACKAGE=$(grep "packageName" "$MOBILE_APP_DIR/src/config/firebase.ts" | sed 's/.*"\(.*\)".*/\1/')
GOOGLE_SERVICES_PACKAGE=$(grep "package_name" "$MOBILE_APP_DIR/android/app/google-services.json" | sed 's/.*"\(.*\)".*/\1/')

echo "   Android package: $ANDROID_PACKAGE"
echo "   Firebase package: $FIREBASE_PACKAGE"
echo "   Google Services package: $GOOGLE_SERVICES_PACKAGE"

if [ "$ANDROID_PACKAGE" = "$FIREBASE_PACKAGE" ] && [ "$FIREBASE_PACKAGE" = "$GOOGLE_SERVICES_PACKAGE" ]; then
    echo "✅ Package names are consistent"
else
    echo "❌ Package name mismatch detected!"
    echo "   Expected: com.recoverymilestonetracker"
    echo "   Please fix package name consistency before continuing"
    exit 1
fi
echo ""

# Step 3: Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
cd "$MOBILE_APP_DIR"
if npx tsc --noEmit >/dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation errors detected!"
    echo "   Run 'npx tsc --noEmit' to see errors"
    exit 1
fi
echo ""

# Step 4: Install missing dependencies
echo "📦 Checking and installing dependencies..."
if [ ! -d "$MOBILE_APP_DIR/node_modules/@types/react-native-vector-icons" ]; then
    echo "📥 Installing missing type declarations..."
    cd "$MOBILE_APP_DIR"
    npm install --save-dev @types/react-native-vector-icons
fi

if [ ! -d "$MOBILE_APP_DIR/node_modules/@react-native-community/cli" ]; then
    echo "📥 Installing React Native CLI..."
    cd "$MOBILE_APP_DIR"
    npm install --save-dev @react-native-community/cli
fi
echo "✅ Dependencies verified"
echo ""

# Step 5: Start backend server
echo "🚀 Starting backend server..."
cd "$BACKEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🔧 Starting backend server on port 3000..."
nohup npm start > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_ROOT/backend.pid"

# Wait for backend to be ready
echo "⏳ Waiting for backend server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Backend server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend server failed to start"
        exit 1
    fi
    echo "   Attempt $i/30 - Backend not ready yet..."
    sleep 2
done
echo ""

# Step 6: Start Metro bundler
echo "📱 Starting Metro bundler..."
cd "$MOBILE_APP_DIR"

echo "🔧 Starting Metro bundler on port 8081..."
nohup npx react-native start --reset-cache > "$PROJECT_ROOT/metro.log" 2>&1 &
METRO_PID=$!
echo $METRO_PID > "$PROJECT_ROOT/metro.pid"

# Wait for Metro to be ready
echo "⏳ Waiting for Metro bundler to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8081/ >/dev/null 2>&1; then
        echo "✅ Metro bundler is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Metro bundler failed to start"
        exit 1
    fi
    echo "   Attempt $i/30 - Metro not ready yet..."
    sleep 2
done
echo ""

# Step 7: Deploy React Native app
echo "📱 Deploying React Native app to emulator..."
cd "$MOBILE_APP_DIR"

# Check if emulator is connected
if ! adb devices | grep -q "emulator"; then
    echo "❌ No emulator detected. Please start an Android emulator first."
    echo "   Available devices:"
    adb devices
    exit 1
fi

echo "🚀 Building and deploying app..."
nohup npx react-native run-android > "$PROJECT_ROOT/rn-app.log" 2>&1 &
RN_APP_PID=$!
echo $RN_APP_PID > "$PROJECT_ROOT/rn-app.pid"

echo "⏳ App deployment in progress..."
echo "   Check $PROJECT_ROOT/rn-app.log for build progress"
echo ""

# Step 8: Final status check
echo "🎉 Configuration restoration complete!"
echo ""
echo "📋 Services Status:"
echo "   🔧 Backend Server: http://localhost:3000 (PID: $BACKEND_PID)"
echo "   📱 Metro Bundler: http://localhost:8081 (PID: $METRO_PID)"
echo "   📱 React Native App: Deploying (PID: $RN_APP_PID)"
echo ""
echo "📱 App should be loading on your emulator shortly..."
echo "   - Login button should be green"
echo "   - Hot reloading should work"
echo "   - All features should be functional"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $METRO_PID $RN_APP_PID"
echo ""
echo "📊 Monitor logs:"
echo "   tail -f $PROJECT_ROOT/backend.log"
echo "   tail -f $PROJECT_ROOT/metro.log"
echo "   tail -f $PROJECT_ROOT/rn-app.log"
echo ""
echo "✅ Restoration complete! Your development environment is ready."
