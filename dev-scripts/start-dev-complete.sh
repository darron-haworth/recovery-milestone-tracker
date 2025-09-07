#!/bin/bash

# Complete Development Environment Startup Script
# This script handles everything: ADB reverse, backend, Metro, and Android app

set -e  # Exit on any error

echo "🚀 Starting Complete Recovery Milestone Tracker Development Environment..."

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
MOBILE_APP_DIR="$PROJECT_ROOT/mobile-app"

echo "📍 Project root: $PROJECT_ROOT"
echo "🔧 Backend directory: $BACKEND_DIR"
echo "📱 Mobile app directory: $MOBILE_APP_DIR"

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
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pids" ]; then
        echo "🛑 Killing processes on port $port: $pids"
        echo $pids | xargs kill -9 2>/dev/null || true
        sleep 2
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

# Function to setup ADB reverse
setup_adb_reverse() {
    echo "📱 Setting up ADB reverse port forwarding..."
    
    # Check if ADB is available
    if ! command -v adb &> /dev/null; then
        echo "❌ ADB not found. Please install Android SDK platform-tools"
        return 1
    fi
    
    # Check if device is connected
    if ! adb devices | grep -q "device$"; then
        echo "❌ No Android device/emulator connected. Please start an emulator or connect a device"
        return 1
    fi
    
    # Set up port forwarding
    adb reverse tcp:8081 tcp:8081
    echo "✅ ADB reverse port forwarding set up (8081 -> 8081)"
}

# Function to start backend server
start_backend() {
    echo "🔧 Starting backend server..."
    
    # Kill any existing processes on port 3000
    kill_port 3000
    
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
    
    # Kill any existing processes on port 8081
    kill_port 8081
    
    cd "$MOBILE_APP_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing mobile app dependencies..."
        npm install
    fi
    
    # Start Metro bundler in background using metro directly
    echo "🚀 Starting Metro bundler on port 8081..."
    nohup npx metro start --reset-cache --host 0.0.0.0 > "$PROJECT_ROOT/metro.log" 2>&1 &
    METRO_PID=$!
    
    # Save PID to file for later cleanup
    echo $METRO_PID > "$PROJECT_ROOT/metro.pid"
    
    # Wait for Metro to be ready (test bundle endpoint)
    echo "⏳ Waiting for Metro to be ready..."
    sleep 5
    
    # Test if Metro is serving bundles correctly
    if curl -s "http://localhost:8081/index.bundle?platform=android" | head -1 | grep -q "var __BUNDLE_START_TIME__"; then
        echo "✅ Metro bundler started successfully (PID: $METRO_PID)"
    else
        echo "❌ Metro bundler failed to serve bundles correctly"
        echo "📋 Metro logs:"
        tail -20 "$PROJECT_ROOT/metro.log"
        exit 1
    fi
}

# Function to deploy Android app
deploy_android() {
    echo "📱 Deploying Android app to emulator..."
    
    cd "$MOBILE_APP_DIR"
    
    # Run the Android app
    echo "🚀 Building and deploying Android app..."
    npx react-native run-android
    
    echo "✅ Android app deployed successfully!"
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
    
    echo "✅ Cleanup complete"
}

# Set up signal handlers for cleanup
trap cleanup EXIT INT TERM

# Main execution
echo "🔍 Setting up development environment..."

# Setup ADB reverse first
setup_adb_reverse

# Start backend
start_backend

# Start Metro bundler
start_metro

# Deploy Android app
deploy_android

echo ""
echo "🎉 Complete development environment is ready!"
echo ""
echo "📋 Services running:"
echo "   🔧 Backend Server: http://localhost:3000"
echo "   📱 Metro Bundler: http://localhost:8081"
echo "   📱 Android App: Deployed to emulator"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Keep script running to monitor
echo "📊 Monitoring services (Ctrl+C to stop)..."
echo ""

# Show logs from both services
tail -f "$PROJECT_ROOT/backend.log" "$PROJECT_ROOT/metro.log" &
TAIL_PID=$!

# Wait for interrupt
wait $TAIL_PID

# Cleanup will be handled by the trap
