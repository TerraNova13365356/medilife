import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDE-wa5E-MToEWgcJlSb2sl6LI1X8aAzCM",
  authDomain: "verdant-market-392401.firebaseapp.com",
  databaseURL: "https://verdant-market-392401-default-rtdb.firebaseio.com",
  projectId: "verdant-market-392401",
  storageBucket: "verdant-market-392401.appspot.com",
  messagingSenderId: "359504785858",
  appId: "1:359504785858:web:a6ff04873959e3b280a65b",
  measurementId: "G-1ZDLFE2JE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
