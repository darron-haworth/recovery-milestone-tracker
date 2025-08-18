# Recovery Milestone Tracker

A production-ready React Native application for tracking recovery milestones with native Firebase integration, designed to support individuals in their recovery journey with privacy-first architecture and comprehensive milestone tracking.

## 🎯 Project Overview

The Recovery Milestone Tracker is a mobile application that helps individuals track their recovery milestones, connect with friends in recovery, and stay motivated throughout their journey. Built with privacy and security as top priorities, the app provides a supportive environment for celebrating achievements and building a recovery community.

## 🏗️ Architecture

### Tech Stack

**Frontend (Mobile App)**
- **React Native** with TypeScript
- **Firebase SDK** (Native integration)
- **Redux Toolkit** for state management
- **React Navigation v6** for navigation
- **React Native Keychain** for secure storage
- **CryptoJS** for data encryption

**Backend (API)**
- **Node.js** with Express
- **Firebase Admin SDK**
- **Firestore** for database
- **Firebase Auth** for authentication
- **Firebase Cloud Messaging** for push notifications

**Shared**
- **TypeScript** for type safety
- **Shared constants and types**

## 📱 Features

### Core Features
- ✅ **Milestone Tracking**: Track recovery milestones with customizable categories
- ✅ **Friend Connections**: Connect with friends in recovery via QR codes or manual entry
- ✅ **Privacy-First Design**: Anonymous profiles and secure data handling
- ✅ **Push Notifications**: Milestone reminders and encouragement messages
- ✅ **Offline Support**: Work without internet connection
- ✅ **Secure Storage**: Encrypted local data storage

### Security Features
- 🔐 **End-to-End Encryption**: Sensitive data encrypted at rest
- 🔐 **Secure Token Storage**: Authentication tokens stored in device keychain
- 🔐 **Privacy Controls**: Granular privacy settings for user data
- 🔐 **Anonymous Mode**: Use app without revealing personal information

### Recovery Support
- 🤝 **Fellowship Integration**: Support for AA, NA, GA, and other fellowships
- 📊 **Progress Tracking**: Visual progress indicators and statistics
- 💪 **Motivational Features**: Daily encouragement and milestone celebrations
- 🆘 **Crisis Resources**: Quick access to support resources

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/recovery-milestone-tracker.git
   cd recovery-milestone-tracker
   ```

2. **Install mobile app dependencies**
   ```bash
   cd mobile-app
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Setup Firebase**
   - Create a Firebase project
   - Download `google-services.json` for Android
   - Download `GoogleService-Info.plist` for iOS
   - Place them in the appropriate directories
   - Download Firebase Admin SDK key for backend

5. **Environment Configuration**
   ```bash
   # Backend .env file
   cd backend
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the mobile app**
   ```bash
   cd mobile-app
   # For Android
   npm run android
   # For iOS
   npm run ios
   ```

## 📁 Project Structure

```
recovery-milestone-tracker/
├── mobile-app/                    # React Native app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── screens/              # App screens
│   │   ├── navigation/           # Navigation configuration
│   │   ├── services/             # Firebase and API services
│   │   ├── store/                # Redux store and slices
│   │   ├── context/              # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript type definitions
│   ├── android/                  # Android-specific files
│   ├── ios/                      # iOS-specific files
│   └── package.json
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Express middleware
│   │   ├── config/               # Configuration files
│   │   └── services/             # Business logic
│   └── package.json
└── shared/                       # Shared types and constants
    ├── types.ts
    ├── constants.ts
    └── milestoneTypes.ts
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
- **Secure Storage**: Authentication tokens stored in device keychain
- **Privacy Controls**: User-controlled data sharing settings
- **Anonymous Mode**: Use app without personal identification
- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Comprehensive validation on all inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
