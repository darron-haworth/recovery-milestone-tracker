#!/bin/bash

# Create GitHub Release with APK Artifact
# Usage: ./create-release.sh <version> <apk-file> [release-notes]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI found${NC}"
    USE_GH_CLI=true
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Will provide manual instructions.${NC}"
    USE_GH_CLI=false
fi

# Function to show manual instructions
show_manual_instructions() {
    local version=$1
    local apk_file=$2
    local release_notes=$3
    
    echo -e "\n${BLUE}📋 Manual Release Instructions:${NC}"
    echo -e "${YELLOW}1. Go to: https://github.com/darron-haworth/recovery-milestone-tracker/releases/new${NC}"
    echo -e "${YELLOW}2. Click 'Choose a tag' and select: ${GREEN}v${version}${NC}"
    echo -e "${YELLOW}3. Release title: ${GREEN}Our Time Recovered v${version}${NC}"
    echo -e "${YELLOW}4. Release notes:${NC}"
    echo -e "${GREEN}${release_notes}${NC}"
    echo -e "${YELLOW}5. Attach APK file: ${GREEN}${apk_file}${NC}"
    echo -e "${YELLOW}6. Click 'Publish release'${NC}"
    echo -e "\n${BLUE}📁 APK Location: ${GREEN}${REPO_ROOT}/${apk_file}${NC}"
}

# Main function
main() {
    local version=$1
    local apk_file=$2
    local release_notes=$3
    
    if [ -z "$version" ] || [ -z "$apk_file" ]; then
        echo -e "${RED}❌ Usage: $0 <version> <apk-file> [release-notes]${NC}"
        echo -e "${YELLOW}Example: $0 3.1.0 OTR.v3.1.0-build6-network-fix.apk${NC}"
        exit 1
    fi
    
    # Default release notes if not provided
    if [ -z "$release_notes" ]; then
        release_notes="## Our Time Recovered v${version}

### 🚀 What's New
- Production APK with Firebase Functions backend integration
- Network security fixes for physical device compatibility
- Improved authentication flow

### 📱 Installation
Download the APK file and install on your Android device.

### 🔧 Technical Details
- Version: ${version}
- Backend: Firebase Functions (Production)
- Target: Android API 24+
- Architecture: ARM64, ARMv7, x86, x86_64"
    fi
    
    echo -e "${BLUE}🏷️  Creating Release for v${version}${NC}"
    echo -e "${BLUE}📱 APK: ${apk_file}${NC}"
    
    # Check if APK file exists
    if [ ! -f "${REPO_ROOT}/${apk_file}" ]; then
        echo -e "${RED}❌ APK file not found: ${REPO_ROOT}/${apk_file}${NC}"
        exit 1
    fi
    
    # Check if tag exists
    if ! git tag -l | grep -q "^v${version}$"; then
        echo -e "${RED}❌ Git tag v${version} not found. Please create the tag first.${NC}"
        echo -e "${YELLOW}Run: git tag -a v${version} -m \"Release v${version}\"${NC}"
        exit 1
    fi
    
    if [ "$USE_GH_CLI" = true ]; then
        echo -e "${GREEN}🚀 Creating release with GitHub CLI...${NC}"
        
        # Create release with GitHub CLI
        gh release create "v${version}" \
            "${REPO_ROOT}/${apk_file}" \
            --title "Our Time Recovered v${version}" \
            --notes "$release_notes" \
            --latest
            
        echo -e "${GREEN}✅ Release created successfully!${NC}"
        echo -e "${BLUE}🔗 View at: https://github.com/darron-haworth/recovery-milestone-tracker/releases/tag/v${version}${NC}"
    else
        show_manual_instructions "$version" "$apk_file" "$release_notes"
    fi
}

# Run main function with all arguments
main "$@"
