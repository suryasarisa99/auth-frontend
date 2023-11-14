import { useEffect, useState } from "react";
import { auth, googleProvider } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
function Signin({ cu, setCU }) {
  const navigate = useNavigate();
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
