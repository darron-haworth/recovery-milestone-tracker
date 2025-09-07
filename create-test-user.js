const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./functions/service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'recovery-milestone-tracker'
});

async function createTestUser() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'test@example.com',
      password: 'testpass123',
      displayName: 'Test User',
      emailVerified: true
    });
    
    console.log('✅ Test user created successfully:');
    console.log('UID:', userRecord.uid);
    console.log('Email:', userRecord.email);
    console.log('Display Name:', userRecord.displayName);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    process.exit(1);
  }
}

createTestUser();
