import { useEffect, useState } from "react";
import { auth, googleProvider } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

export default function Test() {
  const navigate = useNavigate();
  const [cu, setCU] = useState(null);

  const signIn = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithPopup(auth, googleProvider);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  return (
    <div className="signin">
      <p className="google" onClick={signIn}>
        Sigin In With Google
      </p>
    </div>
  );
}
