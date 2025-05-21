import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXdA1qma7bBxwlHhBzpj3K9dWATBVlmdU",
  authDomain: "gdoubleh-10764.firebaseapp.com",
  projectId: "gdoubleh-10764",
  storageBucket: "gdoubleh-10764.firebasestorage.app",
  messagingSenderId: "141035104116",
  appId: "1:141035104116:web:ad6d76e59f952627b06e21",
  measurementId: "G-S1T9ZDH0HQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export{auth, db, googleProvider};