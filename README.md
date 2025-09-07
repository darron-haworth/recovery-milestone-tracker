# Recovery Milestone Tracker

A production-ready React Native application for tracking recovery milestones with native Firebase integration, designed to support individuals in their recovery journey with privacy-first architecture and comprehensive milestone tracking.

## 🎯 Project Overview

The Recovery Milestone Tracker is a mobile application that helps individuals track their recovery milestones, connect with friends in recovery, and stay motivated throughout their journey. Built with privacy and security as top priorities, the app provides a supportive environment for celebrating achievements and building a recovery community.

## 🏗️ Architecture

### Tech Stack

**Frontend (Mobile App)**
- **React Native 0.81.0** with TypeScript 5.8.3
- **React Native CLI 20.0.1** for development tools
- **Firebase SDK 22.4.0** (Native integration)
  - Firebase Auth, Firestore, Analytics, Messaging
- **Redux Toolkit 2.2.1** for state management
- **React Navigation v6** for navigation
- **React Native Vector Icons 10.1.0** for UI icons
- **React Native Linear Gradient 2.8.3** for modern UI effects
- **React Native Safe Area Context 5.6.1** for safe area handling
- **React Native Keychain 8.1.3** for secure storage
- **Redux Persist 6.0.0** with encryption for offline data
- **React Native Gesture Handler 2.28.0** for touch interactions
- **React Native Screens 4.15.4** for native screen management
- **React Native SVG 15.12.1** for vector graphics
- **React Native Haptic Feedback 2.3.3** for tactile feedback

**Backend (API)**
- **Node.js 20.19.4** with Express 4.18.2
- **Firebase Admin SDK 12.0.0**
- **Firestore** for database
- **Firebase Auth** for authentication
- **Firebase Cloud Messaging** for push notifications
- **Security middleware**: Helmet 7.1.0, CORS 2.8.5, Rate limiting
- **Validation**: Joi 17.11.0, Express Validator 7.0.1
- **Logging**: Winston 3.11.0, Morgan 1.10.0
- **Additional tools**: Nodemailer 6.9.7, Twilio 4.19.0, Moment 2.29.4

**Shared**
- **TypeScript** for type safety across the stack
- **Shared constants, types, and milestone definitions**

## 📱 Features

### Core Features
- ✅ **User Authentication**: Secure Firebase Auth integration
- ✅ **Profile Management**: Editable user profiles with nickname support
- ✅ **Recovery Type Tracking**: Support for Alcoholism, Drug Addiction, Gambling, Sex Addiction, Food Addiction, Undisclosed, and Other
- ✅ **Sobriety Date Tracking**: Calculate and display sobriety duration
- ✅ **Friend Connections**: Connect with friends in recovery (placeholder screens)
- ✅ **Milestone Tracking**: Track recovery milestones (placeholder screens)
- ✅ **Privacy-First Design**: Anonymous profiles and secure data handling
- ✅ **Offline Support**: Redux Persist with encryption
- ✅ **Secure Storage**: Encrypted local data storage

### Security Features
- 🔐 **End-to-End Encryption**: Sensitive data encrypted at rest
- 🔐 **Secure Token Storage**: Authentication tokens stored securely
- 🔐 **Privacy Controls**: User-controlled data sharing settings
- 🔐 **Anonymous Mode**: Use app without revealing personal information
- 🔐 **Input Validation**: Comprehensive validation on all inputs

### Recovery Support
- 🤝 **Program Integration**: Support for AA, NA, GA, CA, MA, HA, SA, and other programs
- 📊 **Progress Tracking**: Visual progress indicators and statistics
- 💪 **Motivational Features**: Daily encouragement and milestone celebrations

## 🏥 Recovery Types & Programs

The app supports multiple recovery types with associated recovery programs:

### Recovery Types
| **Recovery Type** | **Description** | **Available Programs** |
|------------------|-----------------|---------------------------|
| **Alcoholism** | Recovery from alcohol addiction and alcoholism | AA, Unaffiliated, Other |
| **Drug Addiction** | Recovery from drug addiction and substance use disorders | NA, AA, CA, MA, HA, Unaffiliated, Other |
| **Gambling** | Recovery from gambling addiction and compulsive gambling | GA, Unaffiliated, Other |
| **Sex Addiction** | Recovery from sex addiction and compulsive sexual behavior | SA, Unaffiliated, Other |
| **Food Addiction** | Recovery from food addiction and compulsive eating behaviors | Unaffiliated, Other |
| **Undisclosed** | Recovery journey details are kept private | Unaffiliated, Other |
| **Other** | Recovery from other types of addiction and compulsive behaviors | CA, MA, HA, SA, Unaffiliated, Other |

### Recovery Programs
| **Program** | **Full Name** | **Website** | **Phone** |
|-------------|---------------|-------------|-----------|
| **AA** | Alcoholics Anonymous | [aa.org](https://www.aa.org) | 1-212-870-3400 |
| **NA** | Narcotics Anonymous | [na.org](https://www.na.org) | 1-818-773-9999 |
| **GA** | Gamblers Anonymous | [gamblersanonymous.org](https://www.gamblersanonymous.org) | 1-213-386-8789 |
| **CA** | Cocaine Anonymous | [ca.org](https://ca.org) | 1-310-559-5833 |
| **MA** | Marijuana Anonymous | [marijuana-anonymous.org](https://www.marijuana-anonymous.org) | 1-800-766-6779 |
| **HA** | Heroin Anonymous | [heroin-anonymous.org](https://heroin-anonymous.org) | 1-855-437-4626 |
| **SA** | Sexaholics Anonymous | [sa.org](https://www.sa.org) | 1-866-424-8777 |
| **Unaffiliated** | Self-sponsorship, therapy, medical treatment, or other non-program approaches | - | - |
| **Other** | Other Program | - | - |

### Crisis Resources
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-HELP

## 🚀 Getting Started

### Prerequisites

- **Node.js 20.19.4 or higher** (tested with v20.19.4)
- **React Native CLI 20.0.1** (latest)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase project** setup
- **Android SDK** (API level 24+, Target API 35)
- **Java Development Kit (JDK)** for Android development
- **CocoaPods** (for iOS development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/recovery-milestone-tracker.git
   cd recovery-milestone-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install mobile app dependencies
   cd mobile-app
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Cloud Messaging
   - Download `google-services.json` for Android
   - Download `GoogleService-Info.plist` for iOS
   - Place them in the appropriate directories:
     - `mobile-app/android/app/google-services.json`
     - `mobile-app/ios/RecoveryMilestoneTracker/GoogleService-Info.plist`
   - Generate Firebase Admin SDK service account key for backend

4. **Environment Configuration**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

5. **Start development environment (Recommended)**
   ```bash
   # From project root
   chmod +x dev-scripts/start-dev-environment.sh
   ./dev-scripts/start-dev-environment.sh
   ```

   This script automatically:
   - Sets up Android environment variables
   - Starts the backend server
   - Starts Metro bundler
   - Launches the React Native app

6. **Manual start (Alternative)**
   ```bash
   # Terminal 1: Start backend
   cd backend
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-admin-key.json"
   npm run dev
   
   # Terminal 2: Start Metro
   cd mobile-app
   npm start
   
   # Terminal 3: Launch app
   cd mobile-app
   npm run android  # or npm run ios
   ```

7. **Stop all processes**
   ```bash
   # From project root
   ./dev-scripts/stop-everything.sh
   ```

## 📁 Project Structure

```
recovery-milestone-tracker/
├── mobile-app/                    # React Native app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   └── common/          # Common UI components (ErrorBoundary, LoadingScreen)
│   │   ├── screens/              # App screens
│   │   │   ├── auth/            # Login, Signup, ForgotPassword, Onboarding
│   │   │   ├── profile/         # User profile management
│   │   │   ├── friends/         # Friend management
│   │   │   ├── milestones/      # Milestone tracking
│   │   │   └── SettingsScreen.tsx
│   │   ├── navigation/           # Navigation configuration (AppNavigator, AuthNavigator, TabNavigator)
│   │   ├── services/             # Firebase and API services
│   │   ├── store/                # Redux store and slices
│   │   ├── context/              # React Context providers (Auth, Friends, Notifications)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Utility functions (encryption, crypto-polyfill)
│   │   ├── config/               # Firebase configuration
│   │   ├── constants.ts          # App-wide constants
│   │   ├── recoveryTypes.ts      # Recovery type definitions
│   │   ├── milestoneTypes.ts     # Milestone type definitions
│   │   └── types.ts              # TypeScript type definitions
│   ├── android/                  # Android-specific files
│   ├── ios/                      # iOS-specific files
│   ├── __tests__/                # Test files
│   ├── App.tsx                   # Main app component
│   ├── package.json
│   └── tsconfig.json
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── routes/               # API routes (auth, user, friends, milestones, notifications)
│   │   ├── middleware/           # Express middleware (auth, error handling)
│   │   ├── config/               # Configuration files (Firebase Admin SDK)
│   │   ├── controllers/          # Route controllers
│   │   ├── models/               # Data models
│   │   ├── services/             # Business logic
│   │   └── utils/                # Utility functions
│   ├── server.js                 # Main server file
│   ├── setup-env.sh              # Environment setup script
│   ├── test-all-endpoints.sh     # API testing script
│   └── package.json
├── shared/                       # Shared types and constants
│   ├── types.ts
│   ├── constants.ts
│   ├── milestoneTypes.ts
│   └── recoveryTypes.ts
├── docs/                         # Documentation
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── brand_guide.md            # Brand guidelines
│   ├── PRODUCTION_DEPLOYMENT.md  # Production deployment guide
│   ├── deployment-config.md      # Mobile app deployment configuration
│   └── FIREBASE_SETUP.md         # Firebase setup instructions
├── functions/                    # Firebase Cloud Functions (if used)
├── dev-scripts/                  # Development and deployment scripts
│   ├── start-dev-environment.sh  # Automated dev environment setup
│   ├── stop-everything.sh        # Stop all running processes
│   ├── deploy-firebase.sh        # Firebase deployment script
│   ├── deploy-backend-production.sh # Backend production deployment
│   ├── setup-android-env.sh      # Android environment setup
│   ├── run-android.sh            # Run Android app
│   ├── run-android-auto.sh       # Auto-run Android app
│   ├── launch-dev.sh             # Development launcher
│   ├── start-dev-vscode.sh       # VS Code development setup
│   ├── start-dev-environment-nonblocking.sh # Non-blocking dev setup
│   ├── setup-env.sh              # Environment setup
│   ├── setup-production.sh       # Production setup
│   └── test-all-endpoints.sh     # API endpoint testing
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore indexes
├── storage.rules                 # Firebase Storage rules
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Cloud Messaging

2. **Mobile App Configuration**
   - Add Android and iOS apps to your Firebase project
   - Download configuration files
   - Place them in the appropriate directories

3. **Backend Configuration**
   - Generate Firebase Admin SDK service account key
   - Place the key file in the backend directory
   - Update environment variables
   - See [Backend Setup](#backend-setup) for detailed instructions

## 🔧 Backend Setup

### Firebase Admin SDK Configuration

The backend uses Firebase Admin SDK for server-side authentication and user management. Follow these steps to set it up:

#### 1. Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Place it in a secure location (e.g., `~/firebase-keys/`)

#### 2. Set Environment Variables

```bash
# Set the path to your service account key
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-admin-key.json"

# Or set it in your .env file
echo "GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-admin-key.json" >> .env
```

#### 3. Run Backend Setup Script

```bash
cd backend
chmod +x setup-env.sh
./setup-env.sh
```

This script will:
- Create a `.env` file with proper configuration
- Set up Firebase project settings
- Configure CORS and security settings

#### 4. Start the Backend Server

```bash
# With environment variable
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-admin-key.json"
npm start

# Or using the setup script
./setup-env.sh && npm start
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
USE_FIRESTORE=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:19006
JWT_SECRET=dev-jwt-secret-change-in-production
ENCRYPTION_KEY=dev-encryption-key-change-in-production
```

**Required Environment Variables:**
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Firebase service account key
- `FIREBASE_PROJECT_ID`: Your Firebase project ID (replace `your-project-id`)
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket (replace `your-project-id`)

#### 5. Test Backend API

Once the backend is running, test the authentication endpoints:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test user signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "displayName": "Test User"
  }'

# Test user login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'

# Test password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Responses:**
- **Health**: `{"status":"OK","timestamp":"...","uptime":...}`
- **Signup**: `{"success":true,"message":"User registered successfully","data":{...}}`
- **Login**: `{"success":true,"message":"Login successful","data":{...}}`
- **Password Reset**: `{"success":true,"message":"Password reset email sent"}`

### Android Setup

The project includes automated Android environment setup:
```bash
# Run the setup script
cd mobile-app
chmod +x setup-android-env.sh
./setup-android-env.sh
```

## 🧪 Testing

### Mobile App Testing
```bash
cd mobile-app
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 📦 Building for Production

### Android
```bash
cd mobile-app
npm run build:android:release
```

The APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`

### iOS
```bash
cd mobile-app
npm run build:ios:release
```

The iOS archive will be created at `ios/RecoveryMilestoneTracker.xcarchive`

## 🔒 Security Features

- **Data Encryption**: All sensitive data encrypted using AES-256
- **Secure Storage**: Authentication tokens stored securely
- **Privacy Controls**: User-controlled data sharing settings
- **Anonymous Mode**: Use app without personal identification
- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Comprehensive validation on all inputs
- **Firestore Security Rules**: Database-level security

## 🚀 Development Scripts

### Automated Development Environment
```bash
# Start everything automatically
./dev-scripts/start-dev-environment.sh
```

### Manual Commands
```bash
# Backend
cd backend
npm run dev          # Development with nodemon
npm start            # Production start
npm test             # Run tests
npm run lint         # Run ESLint

# Mobile App
cd mobile-app
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm test             # Run tests
npm run lint         # Run ESLint
npm run build:android:release  # Build Android APK
npm run build:ios:release      # Build iOS archive
npm run bundle:analyze         # Analyze bundle size
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contributing

[![Contributing Guide](https://img.shields.io/badge/Contributing-Guide-blue?style=flat-square)](docs/CONTRIBUTING.md)

Please see our [Contributing Guide](docs/CONTRIBUTING.md) for setup instructions and contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you're in crisis or need immediate support:

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-HELP

## 🙏 Acknowledgments

- Recovery community members for feedback and guidance
- Open source contributors
- Recovery program organizations (AA, NA, GA, etc.) for their support

## 📞 Contact

- **Support Email**: support@recoverymilestonetracker.com
- **Website**: https://recoverymilestonetracker.com
- **Privacy Policy**: https://recoverymilestonetracker.com/privacy

---

**Remember**: Recovery is a journey, not a destination. This app is designed to support you every step of the way. 💪

## 🔄 Recent Updates

- **Version 3.0.0**: Major version increment with comprehensive recovery type system
- **Recovery Type Expansion**: Added Sex Addiction, Food Addiction, and Undisclosed recovery types
- **Program Terminology Update**: Renamed "Fellowship" to "Program" throughout the application
- **Enhanced Recovery Support**: Comprehensive program integration with AA, NA, GA, CA, MA, HA, SA, Unaffiliated, and Other
- **Data Migration**: Automated migration script for updating existing user data
- **Firebase Admin SDK Integration**: Complete backend authentication with Firebase Admin SDK
- **Enhanced Profile UI**: Redesigned profile screen with gradient backgrounds and improved UX
- **Improved Touch Targets**: Larger, more accessible touch areas for navigation
- **Enhanced Data Persistence**: Improved Firebase integration and offline data handling
- **Automated Development Setup**: Added `dev-scripts/start-dev-environment.sh` for easy development
- **Release APK Generation**: Automated APK build with version numbering
- **Comprehensive Documentation**: Updated README and CONTRIBUTING guides
- **Performance Optimizations**: Reduced bundle size and improved app performance

## 📱 Current Build Status

- **App Version**: 3.0.0
- **Version Code**: 4
- **Package Name**: `com.recoverymilestonetracker`
- **Bundle ID**: `com.recoverymilestonetracker` (iOS)
- **Last Release APK**: Available at `mobile-app/android/app/build/outputs/apk/release/app-release.apk`
- **APK Size**: ~69MB
- **Target SDK**: 35 (Android 14)
- **Minimum SDK**: 24 (Android 7.0)
- **React Native Version**: 0.81.0
- **Node.js Version**: 20.19.4
