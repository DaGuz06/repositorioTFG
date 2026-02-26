import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.join(process.cwd(), 'chefpro-87e0d-firebase-adminsdk-fbsvc-4a451aaabf.json');

if (!admin.apps.length) {
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Firebase service account key NOT FOUND at:', serviceAccountPath);
  } else {
    console.log('✅ Firebase service account key found at:', serviceAccountPath);
  }
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'chefpro-87e0d.firebasestorage.app'
  });
}

export const bucket = admin.storage().bucket('chefpro-87e0d.firebasestorage.app');

