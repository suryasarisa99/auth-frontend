import { useContext, useEffect } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import GoogleSignin from "../pages/GoogleSignin";
import { useNavigate, Link } from "react-router-dom";

import { auth, googleProvider } from "../../firebase-config";

export default function Signup() {
  const { server, authStatus } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(cu);
    if (authStatus == "loggedIn") {
      navigate("/");
    }
  }, []);

  return (
    <form
      className="sign-up"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submittting");
        axios
          .post(`${server}/sign-up`, {
            userId: e.target.user.value,
            password: e.target.password.value,
          })
          .then((res) => {
            if (res.data.mssg === "done") navigate("/signin");
          });
      }}
    >
      {/* <h3>SignUp</h3>
      <input type="text" name="user" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button>Submit</button>
      <p>
        <Link to="/signin">Already Have a Account</Link>
      </p> */}

      <GoogleSignin />
    </form>
  );
}
