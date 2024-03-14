import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCJ0gPga5SSXZNidES9Bw6FFw5QeCTng-s",
  authDomain: "authenicator-45353.firebaseapp.com",
  projectId: "authenicator-45353",
  storageBucket: "authenicator-45353.appspot.com",
  messagingSenderId: "540674430213",
  appId: "1:540674430213:web:48e51f687477d2fbbed36c",
  measurementId: "G-P212S8ZVXQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
