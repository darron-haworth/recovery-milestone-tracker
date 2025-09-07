#!/bin/bash

# Stop Development Environment Script
# This script stops all development services

echo "🛑 Stopping Recovery Milestone Tracker Development Environment..."

# Function to stop processes by name pattern
stop_processes() {
    local pattern=$1
    local description=$2
    
    echo "🛑 Stopping $description..."
    
    # Find and kill processes
    local pids=$(pgrep -f "$pattern" 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        echo "   Found processes: $pids"
        echo "$pids" | xargs -r kill -TERM 2>/dev/null || true
        
        # Wait a bit for graceful shutdown
        sleep 2
        
        # Force kill if still running
        local remaining=$(pgrep -f "$pattern" 2>/dev/null || true)
        if [ -n "$remaining" ]; then
            echo "   Force killing remaining processes: $remaining"
            echo "$remaining" | xargs -r kill -KILL 2>/dev/null || true
        fi
        
        echo "✅ $description stopped"
    else
        echo "   No $description processes found"
    fi
}

# Stop backend server
stop_processes "node server.js" "backend server"

# Stop Metro bundler
stop_processes "react-native start" "Metro bundler"

# Stop React Native CLI
stop_processes "react-native run-android" "React Native CLI"

# Stop Gradle daemons (optional - uncomment if needed)
# echo "🛑 Stopping Gradle daemons..."
# ./gradlew --stop 2>/dev/null || true

# Stop Android emulator (optional - uncomment if needed)
# echo "🛑 Stopping Android emulator..."
# adb emu kill 2>/dev/null || true

echo "✅ All development services stopped!"
echo "💡 To start again, run: ./start-dev-environment.sh"
