import { useEffect, useState, useContext } from "react";
import { auth, googleProvider } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { DataContext } from "../context/DataContext";

function Signin() {
  const navigate = useNavigate();
  const { cu, setCU } = useContext(DataContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCU(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(cu);
    if (cu) navigate("/");
  }, [cu]);
  return (
    <div className="signin">
      <p
        className="google"
        onClick={async (e) => {
          e.preventDefault();
          await signInWithPopup(auth, googleProvider);
          setCU(auth.currentUser);
          if (auth.currentUser) navigate("/");
        }}
      >
        Sigin In With Google
      </p>
    </div>
  );
}

export default Signin;
