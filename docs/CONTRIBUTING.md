# Contributing

Thank you for your interest in contributing to this project! This guide will help you set up your development environment and understand our contribution process.

## Code Statistics

This project automatically tracks code statistics using `cloc` and `clocrt`. The results are maintained in the `cloc-results.md` file, which is automatically updated by a pre-commit hook before each commit.

## Prerequisites

Before you can contribute, you'll need to install the following dependencies:

### Required Tools

- **Node.js 20+**: Required for the backend and mobile app
- **React Native CLI**: For mobile app development
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Firebase CLI**: For Firebase project management
- **Go**: The `clocrt` tool is written in Go, so you must have Go installed on your system
- **cloc**: Standard lines-of-code counting tool
- **clocrt**: Go-based tool for generating markdown-formatted code statistics

### Installing Dependencies

1. **Install Node.js 20.19.4+**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a version manager like `nvm`
   - Tested with Node.js v20.19.4

2. **Install React Native CLI 20.0.1**:
   ```bash
   npm install -g @react-native-community/cli@20.0.1
   ```

3. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

4. **Install Go** (if not already installed):
   Follow the official installation guide at [https://golang.org/doc/install](https://golang.org/doc/install)

5. **Install clocrt**:
   ```bash
   go install github.com/michalspano/clocrt/clocrt@latest
   ```

6. **Install cloc** (if not already installed):
   ```bash
   # On Ubuntu/Debian
   sudo apt install cloc
   
   # On macOS
   brew install cloc
   ```

## Development Environment Setup

### 1. Firebase Project Setup

Before you can run the application, you need to set up Firebase:

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Cloud Messaging**

#### Configure Mobile Apps
1. Add Android app to your Firebase project
2. Download `google-services.json` and place it in `mobile-app/android/app/`
3. Add iOS app to your Firebase project
4. Download `GoogleService-Info.plist` and place it in `mobile-app/ios/RecoveryMilestoneTracker/`

#### Configure Backend (Firebase Admin SDK)
1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file and place it in a secure location (e.g., `~/firebase-keys/`)
4. Set the environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-admin-key.json"
   ```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run setup script
chmod +x setup-env.sh
./setup-env.sh

# Start the backend server
npm start
```

The backend will be available at `http://localhost:3000`

### 3. Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# For Android development
cd android
./gradlew clean
cd ..

# Start Metro bundler
npm start

# In another terminal, run the app
npm run android  # or npm run ios
```

### 4. Verify Setup

Test that everything is working:

```bash
# Test backend health
curl http://localhost:3000/health

# Test user signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","displayName":"Test User"}'
```

### 5. Configure Your Go Path

Add your Go binary path to your system's PATH variable by adding this line to your shell configuration file (e.g., `~/.bashrc`, `~/.zshrc`):

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

After adding this line, reload your shell configuration:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### 2. Enable Pre-commit Hook

From your project's root directory, make the pre-commit hook executable:

```bash
chmod +x .git/hooks/pre-commit
```

### 3. Verify Setup

Test that everything is working correctly:

```bash
# Verify Go is installed
go version

# Verify clocrt is available
clocrt --version

# Verify cloc is available
cloc --version
```

## How It Works

Once set up, the pre-commit hook will automatically:

1. Run `cloc` to count lines of code in your project
2. Use `clocrt` to format the results as a Markdown table
3. Update the `cloc-results.md` file with current statistics
4. Stage the updated file as part of your commit

This ensures that code statistics are always up-to-date and accurately reflect the current state of the codebase.

## Codebase Structure & Types

### Recovery Types & Programs

The app supports multiple recovery types with associated recovery programs. When adding new recovery types or programs, ensure consistency across all files:

#### Key Files
- `mobile-app/src/types.ts` - Core type definitions
- `mobile-app/src/recoveryTypes.ts` - Recovery type configurations
- `shared/types.ts` - Shared type definitions
- `shared/recoveryTypes.ts` - Shared recovery type configurations

#### Recovery Types
- **Alcoholism**: AA, Unaffiliated, Other
- **Drug_Addiction**: NA, AA, CA, MA, HA, Unaffiliated, Other
- **Gambling**: GA, Unaffiliated, Other
- **Sex_Addiction**: SA, Unaffiliated, Other
- **Food_Addiction**: Unaffiliated, Other
- **Undisclosed**: Unaffiliated, Other
- **Other**: CA, MA, HA, SA, Unaffiliated, Other

#### Recovery Programs
- **AA**: Alcoholics Anonymous
- **NA**: Narcotics Anonymous
- **GA**: Gamblers Anonymous
- **CA**: Cocaine Anonymous
- **MA**: Marijuana Anonymous
- **HA**: Heroin Anonymous
- **SA**: Sexaholics Anonymous
- **Unaffiliated**: Self-sponsorship, therapy, medical treatment, or other non-program approaches
- **Other**: Other Program

When modifying recovery types or programs, update all four files to maintain consistency.

## Troubleshooting

### Common Issues

#### Firebase Issues
- **"Firebase Admin not initialized"**: Make sure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
- **"Service account file not found"**: Verify the path to your Firebase service account key
- **"Permission denied" on service account**: Check file permissions on your service account key
- **"Project not found"**: Verify your Firebase project ID in the service account key

#### Backend Issues
- **"Cannot find module" errors**: Run `npm install` in the backend directory
- **Port 3000 already in use**: Kill existing processes or change the port in `.env`
- **Firebase connection errors**: Check your internet connection and Firebase project status

#### Mobile App Issues
- **Metro bundler not starting**: Clear cache with `npx react-native start --reset-cache`
- **Android build failures**: Run `cd android && ./gradlew clean` then try again
- **iOS build failures**: Run `cd ios && pod install` then try again

#### Development Tools
- **"clocrt command not found"**: Make sure you've added the Go binary path to your PATH and reloaded your shell
- **Permission denied on pre-commit hook**: Run `chmod +x .git/hooks/pre-commit` to make it executable
- **Go not found**: Ensure Go is properly installed and available in your PATH

### Getting Help

If you encounter issues during setup, please:

1. Check that all prerequisites are installed and properly configured
2. Verify your PATH includes the Go binary directory
3. Open an issue with details about your environment and the specific error you're encountering

## Making Contributions

With your environment set up, you're ready to contribute! The pre-commit hook will automatically handle code statistics tracking, so you can focus on writing great code.

Happy coding! ðŸš€
## Quick Reference

### Common Commands

```bash
# Backend
cd backend
npm install                    # Install dependencies
./setup-env.sh                # Setup environment
npm start                     # Start server
npm run dev                   # Start with nodemon

# Mobile App
cd mobile-app
npm install                   # Install dependencies
npm start                     # Start Metro bundler
npm run android               # Run on Android
npm run ios                   # Run on iOS
npm run lint                  # Run ESLint

# Firebase
firebase login                # Login to Firebase
firebase projects:list        # List projects
firebase apps:list            # List apps
firebase deploy               # Deploy to Firebase

# Testing
curl http://localhost:3000/health                    # Test backend health
curl -X POST http://localhost:3000/api/auth/signup   # Test signup
```

### File Locations

- **Firebase config (Android)**: `mobile-app/android/app/google-services.json`
- **Firebase config (iOS)**: `mobile-app/ios/RecoveryMilestoneTracker/GoogleService-Info.plist`
- **Service account key**: `~/firebase-keys/your-project-firebase-adminsdk-*.json`
- **Backend environment**: `backend/.env`
- **Backend logs**: `backend/server.log`
