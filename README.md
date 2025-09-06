# Recovery Milestone Tracker

A production-ready React Native application for tracking recovery milestones with native Firebase integration, designed to support individuals in their recovery journey with privacy-first architecture and comprehensive milestone tracking.

## 🎯 Project Overview

The Recovery Milestone Tracker is a mobile application that helps individuals track their recovery milestones, connect with friends in recovery, and stay motivated throughout their journey. Built with privacy and security as top priorities, the app provides a supportive environment for celebrating achievements and building a recovery community.

## 🏗️ Architecture

### Tech Stack

**Frontend (Mobile App)**
- **React Native 0.81.0** with TypeScript 5.8.3
- **Firebase SDK 22.0.0** (Native integration)
  - Firebase Auth, Firestore, Analytics, Messaging
- **Redux Toolkit 2.2.1** for state management
- **React Navigation v6** for navigation
- **React Native Vector Icons** for UI icons
- **React Native Linear Gradient** for modern UI effects
- **React Native Safe Area Context** for safe area handling
- **React Native Keychain** for secure storage
- **Redux Persist** with encryption for offline data

**Backend (API)**
- **Node.js 18+** with Express 4.18.2
- **Firebase Admin SDK 12.0.0**
- **Firestore** for database
- **Firebase Auth** for authentication
- **Firebase Cloud Messaging** for push notifications
- **Security middleware**: Helmet, CORS, Rate limiting
- **Validation**: Joi, Express Validator
- **Logging**: Winston, Morgan

**Shared**
- **TypeScript** for type safety across the stack
- **Shared constants, types, and milestone definitions**

## 📱 Features

### Core Features
- ✅ **User Authentication**: Secure Firebase Auth integration
- ✅ **Profile Management**: Editable user profiles with nickname support
- ✅ **Recovery Type Tracking**: Support for Alcoholism, Drug Addiction, Gambling, Food Addiction
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
- 🤝 **Fellowship Integration**: Support for AA, NA, GA, and other fellowships
- 📊 **Progress Tracking**: Visual progress indicators and statistics
- 💪 **Motivational Features**: Daily encouragement and milestone celebrations

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.0.0 or higher**
- **React Native CLI** (latest)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase project** setup
- **Android SDK** (API level 24+)

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
   chmod +x start-dev-environment.sh
   ./start-dev-environment.sh
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
   npm run dev
   
   # Terminal 2: Start Metro
   cd mobile-app
   npm start
   
   # Terminal 3: Launch app
   cd mobile-app
   npm run android  # or npm run ios
   ```

## 📁 Project Structure

```
recovery-milestone-tracker/
├── mobile-app/                    # React Native app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── common/          # Common UI components
│   │   │   ├── friends/         # Friend-related components
│   │   │   └── milestones/      # Milestone components
│   │   ├── screens/              # App screens
│   │   │   ├── auth/            # Login, Signup, ForgotPassword
│   │   │   ├── profile/         # User profile management
│   │   │   ├── friends/         # Friend management (placeholder)
│   │   │   └── milestones/      # Milestone tracking (placeholder)
│   │   ├── navigation/           # Navigation configuration
│   │   ├── services/             # Firebase and API services
│   │   ├── store/                # Redux store and slices
│   │   ├── context/              # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript type definitions
│   │   ├── constants.ts          # App-wide constants
│   │   ├── recoveryTypes.ts      # Recovery type definitions
│   │   └── milestoneTypes.ts     # Milestone type definitions
│   ├── android/                  # Android-specific files
│   ├── ios/                      # iOS-specific files
│   └── package.json
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Express middleware
│   │   ├── config/               # Configuration files
│   │   ├── controllers/          # Route controllers
│   │   ├── models/               # Data models
│   │   ├── services/             # Business logic
│   │   └── utils/                # Utility functions
│   └── package.json
├── shared/                       # Shared types and constants
│   ├── types.ts
│   ├── constants.ts
│   ├── milestoneTypes.ts
│   └── recoveryTypes.ts
├── start-dev-environment.sh      # Automated dev environment setup
├── deploy-firebase.sh            # Firebase deployment script
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
└── storage.rules                 # Firebase Storage rules
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

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-key.json
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

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

### iOS
```bash
cd mobile-app
npm run build:ios:release
```

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
./start-dev-environment.sh
```

### Manual Commands
```bash
# Backend
cd backend
npm run dev          # Development with nodemon
npm start            # Production start

# Mobile App
cd mobile-app
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run lint         # Run ESLint
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
- Fellowship organizations (AA, NA, GA, etc.) for their support

## 📞 Contact

- **Support Email**: support@recoverymilestonetracker.com
- **Website**: https://recoverymilestonetracker.com
- **Privacy Policy**: https://recoverymilestonetracker.com/privacy

---

**Remember**: Recovery is a journey, not a destination. This app is designed to support you every step of the way. 💪

## 🔄 Recent Updates

- **Modern Profile UI**: Redesigned profile screen with gradient backgrounds and improved UX
- **Enhanced Data Persistence**: Improved Firebase integration and offline data handling
- **Automated Development Setup**: Added `start-dev-environment.sh` for easy development
- **Improved Error Handling**: Better error handling and user feedback
- **Performance Optimizations**: Reduced bundle size and improved app performance
