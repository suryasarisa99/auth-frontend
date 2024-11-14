import { SignInMethod } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import GoogleSigninSignin from "./pages/GoogleSignin";
import CreateTotp from "./pages/CreateTotp";
import ShowAuths from "./pages/ShowAuths";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NewCreate from "./pages/NewCreate";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Test from "./pages/TestGoogle";
import { DataContext } from "./context/DataContext";

function App() {
  const navigate = useNavigate();
  const { authStatus } = useContext(DataContext);
  useEffect(() => {
    console.log("authStatus", authStatus);
    if (authStatus == "notLoggedIn") navigate("/signup");
  }, [authStatus]);

  if (authStatus == "loading") return <div></div>;

  return (
    <>
      <Routes>
        {/* <Route path="/signin" element={<Signin />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<ShowAuths />} />
        <Route path="/create" element={<NewCreate />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
