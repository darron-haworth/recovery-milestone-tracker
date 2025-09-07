#!/bin/bash

# React Native Android Runner Script
echo "📱 Starting Recovery Milestone Tracker on Android..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "android" ]; then
    echo "❌ Please run this script from the mobile-app directory"
    exit 1
fi

# Check if Android environment is set up
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please run setup-android-env.sh first"
    exit 1
fi

# Check if AVD is running
echo "🔍 Checking Android Virtual Device status..."
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
    if [ $DEVICES -eq 0 ]; then
        echo "⚠️  No Android devices/emulators detected"
        echo "📱 Starting Android emulator..."
        
        # List available AVDs
        if command -v emulator &> /dev/null; then
            AVD_LIST=$(emulator -list-avds 2>/dev/null)
            if [ -n "$AVD_LIST" ]; then
                echo "Available AVDs:"
                echo "$AVD_LIST"
                echo ""
                echo "🚀 Starting first available AVD..."
                FIRST_AVD=$(echo "$AVD_LIST" | head -n1)
                emulator -avd "$FIRST_AVD" &
                echo "⏳ Waiting for emulator to start..."
                sleep 30
            else
                echo "❌ No AVDs found. Please create one in Android Studio:"
                echo "   Tools → AVD Manager → Create Virtual Device"
                exit 1
            fi
        else
            echo "❌ Android emulator not found. Please install Android Studio"
            exit 1
        fi
    else
        echo "✅ Android device/emulator detected"
    fi
else
    echo "❌ ADB not found. Please run setup-android-env.sh first"
    exit 1
fi

# Wait for device to be ready
echo "⏳ Waiting for device to be ready..."
adb wait-for-device

# Check if Metro bundler is running
echo "🔍 Checking Metro bundler..."
if ! curl -s http://localhost:8081/status > /dev/null 2>&1; then
    echo "🚀 Starting Metro bundler..."
    npx react-native start --reset-cache &
    echo "⏳ Waiting for Metro bundler to start..."
    sleep 10
else
    echo "✅ Metro bundler already running"
fi

# Build and run the app
echo "🔨 Building and installing app..."
npx react-native run-android

echo ""
echo "🎉 App should now be running on your Android device/emulator!"
echo "📱 If you encounter issues:"
echo "   1. Check that your AVD is running"
echo "   2. Ensure Metro bundler is accessible at http://localhost:8081"
echo "   3. Try: adb reverse tcp:8081 tcp:8081"
echo "   4. Check Android Studio logs for errors"







