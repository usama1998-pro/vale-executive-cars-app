import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDYpzSm-iq7Ku75iZQvkvtIKFd01rwKl7Q',
  authDomain: 'vale-executive.firebaseapp.com',
  projectId: 'vale-executive',
  storageBucket: 'vale-executive.firebasestorage.app',
  messagingSenderId: '973584789559',
  appId: '1:973584789559:android:0366a1ba9898ca00d88fb2',
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const db: Firestore = getFirestore(firebaseApp);
