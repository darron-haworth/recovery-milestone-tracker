#!/bin/bash

# Start Development Environment Script
# This script automatically starts the backend server and Metro bundler

set -e  # Exit on any error

echo "🚀 Starting Recovery Milestone Tracker Development Environment..."

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
MOBILE_APP_DIR="$PROJECT_ROOT/mobile-app"

echo "📍 Project root: $PROJECT_ROOT"
echo "🔧 Backend directory: $BACKEND_DIR"
echo "📱 Mobile app directory: $MOBILE_APP_DIR"

# Set up Android environment variables
setup_android_env() {
    echo "🔧 Setting up Android environment variables..."
    
    # Source the Android environment setup script if it exists
    if [ -f "$MOBILE_APP_DIR/setup-android-env.sh" ]; then
        source "$MOBILE_APP_DIR/setup-android-env.sh"
        return $?
    fi
    
    # Fallback: Common Android SDK locations
    ANDROID_LOCATIONS=(
        "$HOME/Android/Sdk"
        "$HOME/Library/Android/sdk"  # macOS
        "/usr/local/android-sdk"
        "/opt/android-sdk"
    )
    
    # Find Android SDK
    for location in "${ANDROID_LOCATIONS[@]}"; do
        if [ -d "$location" ]; then
            export ANDROID_HOME="$location"
            export ANDROID_SDK_ROOT="$location"
            export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools"
            echo "✅ Android SDK found at: $location"
            echo "   ANDROID_HOME: $ANDROID_HOME"
            echo "   ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
            return 0
        fi
    done
    
    echo "⚠️  Android SDK not found in common locations. Please set ANDROID_HOME manually."
    echo "   Common locations: ${ANDROID_LOCATIONS[*]}"
    return 1
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start after $max_attempts attempts"
    return 1
}

# Function to start backend server
start_backend() {
    echo "🔧 Starting backend server..."
    
    if check_port 3000; then
        echo "⚠️  Port 3000 is already in use. Backend might already be running."
        return 0
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start backend server in background
    echo "🚀 Starting backend server on port 3000..."
    nohup npm start > "$PROJECT_ROOT/backend.log" 2>&1 &
    BACKEND_PID=$!
    
    # Save PID to file for later cleanup
    echo $BACKEND_PID > "$PROJECT_ROOT/backend.pid"
    
    # Wait for backend to be ready
    if wait_for_service "http://localhost:3000/health" "Backend Server"; then
        echo "✅ Backend server started successfully (PID: $BACKEND_PID)"
    else
        echo "❌ Failed to start backend server"
        exit 1
    fi
}

# Function to start Metro bundler
start_metro() {
    echo "📱 Starting Metro bundler..."
    
    if check_port 8081; then
        echo "⚠️  Port 8081 is already in use. Metro might already be running."
        return 0
    fi
    
    cd "$MOBILE_APP_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing mobile app dependencies..."
        npm install
    fi
    
    # Start Metro bundler in background
    echo "🚀 Starting Metro bundler on port 8081..."
    nohup npx react-native start --reset-cache > "$PROJECT_ROOT/metro.log" 2>&1 &
    METRO_PID=$!
    
    # Save PID to file for later cleanup
    echo $METRO_PID > "$PROJECT_ROOT/metro.pid"
    
    # Wait for Metro to be ready
    if wait_for_service "http://localhost:8081/status" "Metro Bundler"; then
        echo "✅ Metro bundler started successfully (PID: $METRO_PID)"
    else
        echo "❌ Failed to start Metro bundler"
        exit 1
    fi
}

# Function to launch React Native app
launch_rn_app() {
    echo "📱 Launching React Native app..."
    
    cd "$MOBILE_APP_DIR"
    
    # Wait a bit more for Metro to fully stabilize
    echo "⏳ Waiting for Metro to stabilize..."
    sleep 5
    
    # Launch the app in background
    echo "🚀 Launching React Native app on Android..."
    nohup npx react-native run-android > "$PROJECT_ROOT/rn-app.log" 2>&1 &
    RN_APP_PID=$!
    
    # Save PID to file for later cleanup
    echo $RN_APP_PID > "$PROJECT_ROOT/rn-app.pid"
    
    echo "✅ React Native app launch initiated (PID: $RN_APP_PID)"
    echo "   Check $PROJECT_ROOT/rn-app.log for build progress"
}

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    
    # Kill backend if PID file exists
    if [ -f "$PROJECT_ROOT/backend.pid" ]; then
        BACKEND_PID=$(cat "$PROJECT_ROOT/backend.pid")
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo "🛑 Stopping backend server (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
        fi
        rm -f "$PROJECT_ROOT/backend.pid"
    fi
    
    # Kill Metro if PID file exists
    if [ -f "$PROJECT_ROOT/metro.pid" ]; then
        METRO_PID=$(cat "$PROJECT_ROOT/metro.pid")
        if kill -0 $METRO_PID 2>/dev/null; then
            echo "🛑 Stopping Metro bundler (PID: $METRO_PID)..."
            kill $METRO_PID
        fi
        rm -f "$PROJECT_ROOT/metro.pid"
    fi
    
    # Kill React Native app if PID file exists
    if [ -f "$PROJECT_ROOT/rn-app.pid" ]; then
        RN_APP_PID=$(cat "$PROJECT_ROOT/rn-app.pid")
        if kill -0 $RN_APP_PID 2>/dev/null; then
            echo "🛑 Stopping React Native app (PID: $RN_APP_PID)..."
            kill $RN_APP_PID
        fi
        rm -f "$PROJECT_ROOT/rn-app.pid"
    fi
    
    echo "✅ Cleanup complete"
}

# Set up signal handlers for cleanup
trap cleanup EXIT INT TERM

# Main execution
echo "🔍 Checking current environment..."

# Set up Android environment
setup_android_env

# Start backend first
start_backend

# Start Metro bundler
start_metro

# Launch React Native app
launch_rn_app

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Services running:"
echo "   🔧 Backend Server: http://localhost:3000"
echo "   📱 Metro Bundler: http://localhost:8081"
echo "   📱 React Native App: Building and launching..."
echo ""
echo "📱 App launch status:"
echo "   Check $PROJECT_ROOT/rn-app.log for build progress"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Keep script running and show logs
echo "📊 Monitoring logs (Ctrl+C to stop)..."
echo ""

# Show logs from both services
tail -f "$PROJECT_ROOT/backend.log" "$PROJECT_ROOT/metro.log" &
TAIL_PID=$!

# Wait for interrupt
wait $TAIL_PID

# Cleanup will be handled by the trap
