import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFUEYdwcP_mRsNcr9hZ4mvBnuo16RA8ew",
  authDomain: "water-leakage-monitoring-999f4.firebaseapp.com",
  databaseURL: "https://water-leakage-monitoring-999f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "water-leakage-monitoring-999f4",
  storageBucket: "water-leakage-monitoring-999f4.firebasestorage.app",
  messagingSenderId: "763548807653",
  appId: "1:763548807653:web:a84a821a0445f2b8faff0c",
  measurementId: "G-S93SJC6H8P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
