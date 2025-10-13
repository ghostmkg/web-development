// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import { toast } from "react-toastify";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Values are loaded from environment variables in `netflix/.env`.
// For Create React App, env vars must be prefixed with REACT_APP_.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (name,email,password) =>{
  try{
    //Creating user...💅
    const res= await createUserWithEmailAndPassword(auth,email,password);
    const user = res.user;

    //Adding user to the db...👍
    await addDoc(collection(db,"user"),{
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  }catch (error){
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const login = async (email, password) => {
  try{
    await signInWithEmailAndPassword(auth, email, password);
  }catch(error){
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const logout = () => {
  signOut(auth);
}

export {auth,db,login,signUp,logout}