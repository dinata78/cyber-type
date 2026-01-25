import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCUk7_Hao2fzi46IbQsITtbWFgT25vwwXg",
  authDomain: "cybertype-cc.firebaseapp.com",
  projectId: "cybertype-cc",
  storageBucket: "cybertype-cc.firebasestorage.app",
  messagingSenderId: "706562558907",
  appId: "1:706562558907:web:3204d29de638cbb692929e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "asia-northeast1");

if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8081);
  connectFunctionsEmulator(functions, "localhost", 5001);
}