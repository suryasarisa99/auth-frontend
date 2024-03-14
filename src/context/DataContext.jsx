import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth, googleProvider } from "../../firebase-config";

import { onAuthStateChanged, getAuth } from "firebase/auth";

const DataContext = createContext();
export default function DataProvider({ children }) {
  const [auths, setAuths] = useState([]);
  const [hotps, setHotps] = useState([]);
  const [cu, setCU] = useState(auth.currentUser);
  const [timer, setTimer] = useState([]);
  const [longPress, setLongPress] = useState(false);
  const [selectedTotps, setSelectedTotps] = useState([]);
  const [selectedHotps, setSelectedHotps] = useState([]);
  const itemHeightRef = useRef(78.092);
  const topBarHeightRef = useRef(57);
  const [token, setToken] = useState("");

  // const server = "http://192.168.0.169:3000";
  const server = "https://2fa-b.vercel.app";
  const timerRef = useRef();

  useEffect(() => {
    console.log(cu);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setCU(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setInterval(() => {
      timerRef.current = setTimer(calcTime());
    }, 250);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer > 95) {
      setTimeout(() => {
        getUpdatedData();
      }, 1200);
    }
  }, [timer]);

  function getInitialData() {
    axios
      .post(server, {
        id: auth.currentUser.uid,
      })
      .then((res) => {
        if (res.data.totps) setAuths(res.data.totps);
        if (res.data.hotps) setHotps(res.data.hotps);
        console.log(res.data.hotps);
      });
  }
  function getUpdatedData() {
    if (auth.currentUser?.uid)
      axios
        .post(server, {
          id: auth.currentUser.uid,
        })
        .then((res) => {
          if (res.data.totps) setAuths(res.data.totps);
          console.log(res.data.hotps);
        });
  }
  function openOverlay() {
    document.getElementById("overlay").className = "";
  }
  function closeOverlay() {
    document.getElementById("overlay").className = "hidden";
  }
  function calcTime() {
    const currentTime = Math.floor(Date.now() / 1000);
    const currentStep = Math.floor(currentTime / 30);
    const timeRemaining = (currentStep + 1) * 30 - currentTime;
    const progress = (30 - timeRemaining) / 30;
    return parseInt(progress * 100);
  }
  function calculateItem(y) {
    const topHeight = topBarHeightRef.current + 32 - 9;
    const result = (y - topHeight) / itemHeightRef.current;
    console.log(Math.floor(result));
    return Math.floor(result);
  }
  function createDot(height) {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.top = height + "px";
    document.documentElement.appendChild(dot);
  }
  return (
    <DataContext.Provider
      value={{
        auths,
        setAuths,
        hotps,
        server,
        cu,
        setCU,
        timer,
        setTimer,
        setHotps,
        openOverlay,
        closeOverlay,
        getInitialData,
        getUpdatedData,
        calcTime,
        longPress,
        setLongPress,
        selectedTotps,
        selectedHotps,
        setSelectedTotps,
        setSelectedHotps,
        token,
        setToken,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
