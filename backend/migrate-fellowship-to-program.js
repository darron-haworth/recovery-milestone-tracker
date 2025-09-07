#!/usr/bin/env node

/**
 * Migration Script: Fellowship to Program
 * 
 * This script migrates all user documents in Firestore from using 'fellowship' 
 * to 'program' in the profile object.
 * 
 * Usage:
 *   node migrate-fellowship-to-program.js
 * 
 * Prerequisites:
 *   - Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 *   - Firebase Admin SDK must be properly configured
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin already initialized');
      return admin.app();
    }

    // Get the service account key path from environment variable
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    if (!serviceAccountPath) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    }

    console.log(`🔑 Using service account: ${serviceAccountPath}`);

    // Initialize Firebase Admin SDK
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

// Main migration function
async function migrateFellowshipToProgram() {
  console.log('🚀 Starting Fellowship to Program migration...\n');

  try {
    // Initialize Firebase Admin
    const app = initializeFirebaseAdmin();
    const db = admin.firestore();

    // Get all user documents
    console.log('📋 Fetching all user documents...');
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('ℹ️  No user documents found in Firestore');
      return;
    }

    console.log(`📊 Found ${usersSnapshot.size} user documents to process\n`);

    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Process each user document
    for (const doc of usersSnapshot.docs) {
      try {
        const userId = doc.id;
        const userData = doc.data();
        
        console.log(`👤 Processing user: ${userId}`);
        
        // Check if user has a profile object with fellowship field
        if (userData.profile && userData.profile.fellowship !== undefined) {
          console.log(`  📝 Found fellowship field: ${userData.profile.fellowship}`);
          
          // Create updated profile object with program instead of fellowship
          const updatedProfile = {
            ...userData.profile,
            program: userData.profile.fellowship
          };
          
          // Remove the old fellowship field
          delete updatedProfile.fellowship;
          
          // Update the document
          await db.collection('users').doc(userId).update({
            profile: updatedProfile,
            updatedAt: new Date().toISOString()
          });
          
          console.log(`  ✅ Updated fellowship '${userData.profile.fellowship}' to program '${updatedProfile.program}'`);
          updatedCount++;
        } else {
          console.log(`  ⏭️  No fellowship field found, skipping`);
        }
        
        processedCount++;
        
      } catch (error) {
        console.error(`  ❌ Error processing user ${doc.id}:`, error.message);
        errorCount++;
      }
    }

    // Print migration summary
    console.log('\n📊 Migration Summary:');
    console.log(`  📋 Total documents processed: ${processedCount}`);
    console.log(`  ✅ Documents updated: ${updatedCount}`);
    console.log(`  ❌ Errors encountered: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
    } else {
      console.log(`\n⚠️  Migration completed with ${errorCount} errors`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateFellowshipToProgram()
    .then(() => {
      console.log('\n✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { migrateFellowshipToProgram };
