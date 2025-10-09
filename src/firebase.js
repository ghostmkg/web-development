/**
 * Firebase Configuration and Authentication Module
 * 
 * This module handles all Firebase-related functionality including:
 * - Firebase app initialization
 * - User authentication (signup, login, logout)
 * - Firestore database operations
 * - Error handling with toast notifications
 */

// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import { toast } from "react-toastify";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/**
 * Firebase configuration object
 * Uses environment variables for security - actual values stored in .env file
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);  // Analytics for tracking user behavior
const auth = getAuth(app);            // Authentication service
const db = getFirestore(app);         // Firestore database service

/**
 * User Registration Function
 * Creates a new user account and stores user data in Firestore
 * 
 * @param {string} name - User's display name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 */
const signUp = async (name, email, password) => {
  try {
    // Create user account with Firebase Authentication
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Store additional user information in Firestore database
    await addDoc(collection(db, "user"), {
      uid: user.uid,              // Firebase user ID
      name,                       // User's display name
      authProvider: "local",      // Authentication method
      email,                      // User's email
    });
  } catch (error) {
    console.log(error);
    // Display user-friendly error message
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

/**
 * User Login Function
 * Authenticates user with email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 */
const login = async (email, password) => {
  try {
    // Sign in user with Firebase Authentication
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    // Display user-friendly error message
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

/**
 * User Logout Function
 * Signs out the currently authenticated user
 */
const logout = () => {
  signOut(auth);
}

// Export Firebase services and authentication functions for use in other components
export { auth, db, login, signUp, logout }