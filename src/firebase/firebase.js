
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCsACdjAfz8D1Tq6-OlyMMmu9wlu6YaxWo",
  authDomain: "streamxcoder.firebaseapp.com",
  projectId: "streamxcoder",
  storageBucket: "streamxcoder.firebasestorage.app",
  messagingSenderId: "523970496572",
  appId: "1:523970496572:web:f18f2d325e8a2d895b1b39",
  measurementId: "G-NYPJ2JX5L7",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();



export default app;