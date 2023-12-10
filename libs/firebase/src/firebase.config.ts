import { registerAs } from '@nestjs/config';
import { AppOptions, credential } from 'firebase-admin';
import { resolve } from 'path';

export default registerAs(
  'firebase',
  (): AppOptions => ({
    credential: !!process.env.FIREBASE_KEY_PATH
      ? credential.cert(resolve(process.env.FIREBASE_KEY_PATH))
      : credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
  }),
);
