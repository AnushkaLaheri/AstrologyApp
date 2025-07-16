import { initializeApp, getApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "astro-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "astro-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "astro-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
}
console.log("API KEY: ", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// Singleton pattern – avoids “already exists” errors in hot-reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)


// Firestore works both on server & client
export const db = getFirestore(app)


// Auth must only be accessed in the browser
export const auth = typeof window !== "undefined" ? getAuth(app) : undefined
