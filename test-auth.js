const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: 'recovery-milestone-tracker',
});

async function testAuth() {
  try {
    // Create a custom token for testing
    const customToken = await admin.auth().createCustomToken('xf3OPang2cVKr3qHHtsfiW6bjnq1');
    console.log('✅ Custom token created:', customToken);
    
    // Test the backend login endpoint
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: customToken
      })
    });
    
    const result = await response.json();
    console.log('📡 Backend response:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAuth();
