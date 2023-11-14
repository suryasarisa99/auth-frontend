import { SignInMethod } from "firebase/auth";
import { useEffect, useState } from "react";
import Signin from "./pages/Signin";
import CreateTotp from "./pages/CreateTotp";
import ShowAuths from "./pages/ShowAuths";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function App() {
  const [cu, setCU] = useState();
  const [auths, setAuths] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/signin");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin cu={cu} setCU={setCU} />} />
        <Route
          path="/"
          element={<ShowAuths cu={cu} auths={auths} setAuths={setAuths} />}
        />
        {/* <Route path="/sigin" element={<ShowAuths />} /> */}
      </Routes>
      {/* <Signin cu={cu} setCU={setCU} />
      <CreateTotp cu={cu} setAuths={setAuths} />
      <ShowAuths cu={cu} auths={auths} setAuths={setAuths} /> */}
    </>
  );
}

export default App;
