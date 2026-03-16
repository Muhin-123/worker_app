import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      db: Firestore;
      auth: Auth;
      userId?: string;
      userEmail?: string;
    }
  }
}
