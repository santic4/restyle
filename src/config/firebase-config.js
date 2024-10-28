import admin from 'firebase-admin';
import { clientEmail, privateKey, projectId } from './config.js';

const storageBucket = 'restyle-9b63c.appspot.com';

if (!projectId || !clientEmail || !privateKey || !storageBucket) {
  throw new Error(`Missing Firebase configuration environmenttttt ${privateKey}vaaaaariables.`);
}

const serviceAccount = {
  projectId,
  clientEmail,
  privateKey,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const bucket = admin.storage().bucket();

export { bucket };