import { useEffect, useState, useContext } from "react";
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
import { DataContext } from "../context/DataContext";

function GoogleSignin() {
  const navigate = useNavigate();
  const { cu, setCU } = useContext(DataContext);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      setCU(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(cu);
    if (cu) navigate("/");
  }, [cu, navigate]);

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
    <div className="google-signin">
      <p>Or</p>
      <p className="google" onClick={signIn}>
        Sigin In With Google
      </p>
    </div>
  );
}

export default GoogleSignin;
