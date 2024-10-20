// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjpaAhkEozh8Z_6FMQQheJwe7-msezkLc",
  authDomain: "chat-app-ce234.firebaseapp.com",
  projectId: "chat-app-ce234",
  storageBucket: "chat-app-ce234.appspot.com",
  messagingSenderId: "2582437503",
  appId: "1:2582437503:web:4e652a445fa5b4a6e7a94a",
  measurementId: "G-EC5VS093YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
