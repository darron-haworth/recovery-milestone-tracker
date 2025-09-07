#!/bin/bash

# Setup Android Environment Variables
echo "🔧 Setting up Android environment variables..."

# Common Android SDK locations
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
        echo ""
        echo "🔧 Environment variables set. You can now run:"
        echo "   npx react-native run-android"
        return 0
    fi
done

echo "❌ Android SDK not found in common locations:"
for location in "${ANDROID_LOCATIONS[@]}"; do
    echo "   - $location"
done
echo ""
echo "💡 Please install Android SDK or set ANDROID_HOME manually."
return 1







