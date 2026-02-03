import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDesqXO4_dkgDhCZB0D9YmuR0VOvWWYvk4",
  authDomain: "bu-quiz-df001.firebaseapp.com",
  projectId: "bu-quiz-df001",
  storageBucket: "bu-quiz-df001.firebasestorage.app",
  messagingSenderId: "609781224093",
  appId: "1:609781224093:web:ef4837131c7e979a1eba74",
  measurementId: "G-J40SPKWZ2R",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };

