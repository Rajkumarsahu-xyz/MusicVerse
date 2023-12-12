import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBaYR1ZyjCI6kKlX_WfG44b85Ndpjg0_Ao",
  authDomain: "spotify-project-2219c.firebaseapp.com",
  projectId: "spotify-project-2219c",
  storageBucket: "spotify-project-2219c.appspot.com",
  messagingSenderId: "181441308210",
  appId: "1:181441308210:web:11ae0e79b785ae57a17e2b",
  measurementId: "G-RGK5Z2E9H8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);