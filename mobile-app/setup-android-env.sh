#!/bin/bash

# Android Development Environment Setup Script
echo "🤖 Setting up Android Development Environment..."

# Common Android SDK locations
ANDROID_LOCATIONS=(
    "$HOME/Android/Sdk"
    "/opt/android-studio/Sdk"
    "/usr/local/android-sdk"
    "/opt/android-sdk"
)

# Find Android SDK
ANDROID_SDK_PATH=""
for location in "${ANDROID_LOCATIONS[@]}"; do
    if [ -d "$location" ]; then
        ANDROID_SDK_PATH="$location"
        echo "✅ Found Android SDK at: $ANDROID_SDK_PATH"
        break
    fi
done

if [ -z "$ANDROID_SDK_PATH" ]; then
    echo "❌ Android SDK not found in common locations"
    echo "📝 Please install Android Studio and SDK first"
    echo "   Download from: https://developer.android.com/studio"
    exit 1
fi

# Set environment variables
export ANDROID_HOME="$ANDROID_SDK_PATH"
export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/tools/bin"

# Add to shell profile
SHELL_PROFILE=""
if [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.profile" ]; then
    SHELL_PROFILE="$HOME/.profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    echo "" >> "$SHELL_PROFILE"
    echo "# Android Development Environment" >> "$SHELL_PROFILE"
    echo "export ANDROID_HOME=\"$ANDROID_HOME\"" >> "$SHELL_PROFILE"
    echo "export ANDROID_SDK_ROOT=\"$ANDROID_SDK_ROOT\"" >> "$SHELL_PROFILE"
    echo "export PATH=\"\$PATH:\$ANDROID_HOME/emulator\"" >> "$SHELL_PROFILE"
    echo "export PATH=\"\$PATH:\$ANDROID_HOME/platform-tools\"" >> "$SHELL_PROFILE"
    echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools\"" >> "$SHELL_PROFILE"
    echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools/bin\"" >> "$SHELL_PROFILE"
    echo "✅ Added environment variables to $SHELL_PROFILE"
fi

# Verify setup
echo ""
echo "🔍 Verifying Android setup..."
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

# Check if tools are accessible
if command -v adb &> /dev/null; then
    echo "✅ ADB (Android Debug Bridge) is accessible"
    echo "   Version: $(adb version | head -n1)"
else
    echo "❌ ADB not accessible. Check PATH configuration"
fi

if command -v emulator &> /dev/null; then
    echo "✅ Android Emulator is accessible"
    echo "   Available AVDs:"
    emulator -list-avds 2>/dev/null || echo "   No AVDs found"
else
    echo "❌ Android Emulator not accessible. Check PATH configuration"
fi

echo ""
echo "🚀 Next steps:"
echo "   1. Restart your terminal or run: source $SHELL_PROFILE"
echo "   2. Create an AVD in Android Studio: Tools → AVD Manager"
echo "   3. Start the AVD: emulator -avd YOUR_AVD_NAME"
echo "   4. Run your app: npm run android"
echo ""
echo "📱 To create an AVD manually:"
echo "   - Open Android Studio"
echo "   - Go to Tools → AVD Manager"
echo "   - Click 'Create Virtual Device'"
echo "   - Choose 'Pixel 7' and 'API 34'"
echo "   - Name it 'Pixel7_API34'"







