#!/bin/bash

# Auto-run Android app script
# This script starts the dev environment and then runs the Android app

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting development environment and Android app..."

# Start the development environment in the background
cd "$SCRIPT_DIR"
./start-dev-environment.sh &
DEV_ENV_PID=$!

# Wait a bit for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are ready
echo "🔍 Checking if services are ready..."

# Wait for backend
while ! curl -s "http://localhost:3000/health" >/dev/null 2>&1; do
    echo "   Waiting for backend..."
    sleep 2
done

# Wait for Metro
while ! curl -s "http://localhost:8081/status" >/dev/null 2>&1; do
    echo "   Waiting for Metro..."
    sleep 2
done

echo "✅ Services are ready! Starting Android app..."

# Set Android environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

# Run the Android app
npx react-native run-android

# When the app is done, stop the dev environment
echo "🛑 Stopping development environment..."
kill $DEV_ENV_PID 2>/dev/null || true

# Clean up PID files
rm -f ../backend.pid ../metro.pid 2>/dev/null || true

echo "✅ Done!"
