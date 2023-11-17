import { SignInMethod } from "firebase/auth";
import { useEffect, useState } from "react";
import Signin from "./pages/Signin";
import CreateTotp from "./pages/CreateTotp";
import ShowAuths from "./pages/ShowAuths";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NewCreate from "./pages/NewCreate";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/signin");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<ShowAuths />} />
        <Route path="/create" element={<NewCreate />} />
      </Routes>
    </>
  );
}

export default App;
