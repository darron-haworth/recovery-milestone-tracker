#!/bin/bash

# VS Code Development Environment Startup Script
# This script starts all services without hanging the VS Code interface

set -e

echo "🚀 Starting VS Code Development Environment..."

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo "✅ $service_name is already running on port $port"
        return 0
    else
        echo "❌ $service_name is not running on port $port"
        return 1
    fi
}

# Function to start service in background with proper logging
start_service() {
    local service_name=$1
    local command=$2
    local log_file=$3
    local working_dir=$4
    
    echo "🚀 Starting $service_name..."
    
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$log_file")"
    
    # Start service in background with logging
    cd "$working_dir" && nohup $command > "$log_file" 2>&1 &
    local pid=$!
    
    echo "✅ $service_name started with PID: $pid"
    echo "📝 Logs available at: $log_file"
    
    return $pid
}

# Set up Android environment
echo "🔧 Setting up Android environment..."
source setup-android-env.sh

# Check and start backend
if ! check_service "Backend Server" "3000" "http://localhost:3000/health"; then
    backend_pid=$(start_service "Backend Server" "npm start" "../backend.log" "../backend")
    echo "Backend PID: $backend_pid"
else
    backend_pid="already running"
fi

# Check and start Metro
if ! check_service "Metro Bundler" "8081" "http://localhost:8081/status"; then
    metro_pid=$(start_service "Metro Bundler" "npx react-native start --reset-cache" "../metro.log" ".")
    echo "Metro PID: $metro_pid"
else
    metro_pid="already running"
fi

# Start Android emulator if not running
echo "📱 Starting Android emulator..."
if ! adb devices | grep -q "emulator"; then
    emulator_pid=$(start_service "Android Emulator" "emulator -avd Pixel7_API34" "../emulator.log" ".")
    echo "Emulator PID: $emulator_pid"
else
    echo "✅ Android emulator is already running"
    emulator_pid="already running"
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."

# Wait for backend
if [ "$backend_pid" != "already running" ]; then
    echo "⏳ Waiting for backend server..."
    for i in {1..30}; do
        if check_service "Backend Server" "3000" "http://localhost:3000/health"; then
            break
        fi
        sleep 1
    done
fi

# Wait for Metro
if [ "$metro_pid" != "already running" ]; then
    echo "⏳ Waiting for Metro bundler..."
    for i in {1..30}; do
        if check_service "Metro Bundler" "8081" "http://localhost:8081/status"; then
            break
        fi
        sleep 1
    done
fi

# Wait for emulator
if [ "$emulator_pid" != "already running" ]; then
    echo "⏳ Waiting for Android emulator..."
    for i in {1..60}; do
        if adb devices | grep -q "emulator"; then
            break
        fi
        sleep 1
    done
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📊 Service Status:"
echo "   Backend Server: $(check_service "Backend Server" "3000" "http://localhost:3000/health" > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "   Metro Bundler: $(check_service "Metro Bundler" "8081" "http://localhost:8081/status" > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "   Android Emulator: $(adb devices | grep -q "emulator" && echo "✅ Running" || echo "❌ Not running")"
echo ""
echo "📝 Log files:"
echo "   Backend: ../backend.log"
echo "   Metro: ../metro.log"
echo "   Emulator: ../emulator.log"
echo ""
echo "🚀 You can now:"
echo "   1. Use 'Debug React Native Android' in VS Code to debug the app"
echo "   2. Use 'Debug Backend Server' to debug the backend"
echo "   3. Use 'Full Stack Debug' to debug both simultaneously"
echo "   4. Run 'npx react-native run-android' to launch the app"
echo ""
echo "✅ Script completed - VS Code interface is free!"
