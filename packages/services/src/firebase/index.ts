import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "@career-bridge/config";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId
};

// Initialize Firebase
export const getFirebaseApp = () => {
  if (getApps().length > 0) return getApp();
  try {
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
    throw err;
  }
};

export const getFirebaseAuth = () => getAuth(getFirebaseApp());
export const getFirebaseDb = () => getFirestore(getFirebaseApp());
