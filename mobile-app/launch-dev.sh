#!/bin/bash

# Simple launcher for the development environment
# This script can be run from anywhere

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the mobile app directory and run the start script
cd "$SCRIPT_DIR"
./start-dev-environment.sh
