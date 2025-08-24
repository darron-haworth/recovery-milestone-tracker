# 🔥 Firebase Setup Guide for Recovery Milestone Tracker

## 📋 Prerequisites
- Firebase project: `recovery-milestone-tracker`
- Project ID: `recovery-milestone-tracker`
- Project Number: `677302029618`

## 🚀 Step-by-Step Setup

### 1. Enable Realtime Database

1. **Go to Firebase Console**: https://console.firebase.google.com/project/recovery-milestone-tracker
2. **Click "Realtime Database"** in the left sidebar
3. **Click "Create database"** (if not already created)
4. **Choose location**: Select the closest to your users (e.g., `us-central1`)
5. **Security rules**: Choose "Start in test mode" (we'll secure later)
6. **Click "Done"**

**Expected Database URL**: `https://recovery-milestone-tracker-default-rtdb.firebaseio.com`

### 2. Verify Cloud Storage

1. **Click "Storage"** in the left sidebar
2. **Verify it shows**: `recovery-milestone-tracker.firebasestorage.app`
3. **If not enabled**: Click "Get started" and follow the setup

### 3. Update Backend Environment

```bash
cd backend
nano .env
```

**Add/Update these lines:**
```env
# Firebase Configuration
FIREBASE_DATABASE_URL=https://recovery-milestone-tracker-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
```

### 4. Test Firebase Connection

After enabling the database, restart your backend:

```bash
cd backend
pkill -f "node server.js"
export GOOGLE_APPLICATION_CREDENTIALS="/home/darron/firebase-keys/recovery-milestone-tracker-firebase-adminsdk-fbsvc-b5a53edc5c.json"
nohup node server.js > server.log 2>&1 &
```

### 5. Verify Configuration

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

## 🔧 Current Configuration Status

| Service | Status | URL/Bucket |
|---------|--------|------------|
| **Project ID** | ✅ Ready | `recovery-milestone-tracker` |
| **Storage Bucket** | ✅ Ready | `recovery-milestone-tracker.firebasestorage.app` |
| **Realtime Database** | ❌ **NEEDS ENABLING** | Enable in Firebase Console |
| **Authentication** | ✅ Ready | Configured in google-services.json |
| **Cloud Messaging** | ✅ Ready | Project number: `677302029618` |

## 🚨 Important Notes

- **Realtime Database must be enabled** before the backend can connect
- **Storage bucket is ready** and can be used immediately
- **Authentication is configured** for both Android and iOS
- **API keys are set** for mobile app development

## ✅ Next Steps After Setup

1. **Enable Realtime Database** in Firebase Console
2. **Update backend `.env`** with database URL
3. **Restart backend server**
4. **Test API endpoints**
5. **Verify mobile app connectivity**

## 🆘 Troubleshooting

### Database Connection Failed
- Ensure Realtime Database is enabled in Firebase Console
- Check the database URL in `.env` file
- Verify service account has proper permissions

### Storage Access Denied
- Check storage bucket name in `.env`
- Verify service account has Storage Admin role
- Check Firebase Storage security rules

### Authentication Issues
- Verify `google-services.json` and `GoogleService-Info.plist` are up to date
- Check API keys in Firebase Console
- Ensure proper Firebase SDK initialization

---

**Ready to proceed?** Enable the Realtime Database in Firebase Console, then say "database enabled" to continue!







