# Environment Variables Template

Copy this template to create your `.env` file in the backend directory:

```bash
# Environment Configuration
NODE_ENV=development
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=recovery-milestone-tracker
FIREBASE_STORAGE_BUCKET=recovery-milestone-tracker.firebasestorage.app
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-service-account-key.json
USE_FIRESTORE=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:19006

# Security
JWT_SECRET=dev-jwt-secret-change-in-production
ENCRYPTION_KEY=dev-encryption-key-change-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
APP_NAME=Recovery Milestone Tracker
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@recoverymilestonetracker.com
```

## Setup Instructions

1. Copy this template to `backend/.env`
2. Update the `GOOGLE_APPLICATION_CREDENTIALS` path to point to your Firebase service account key
3. Change the security keys (`JWT_SECRET`, `ENCRYPTION_KEY`) for production use
4. Run `npm start` in the backend directory
