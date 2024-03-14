import { useContext, useEffect } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import GoogleSignin from "../pages/GoogleSignin";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../../firebase-config";

export default function Signin() {
  const { server, cu, setCU, token, setToken, setAuths, setHotps } =
    useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (cu) navigate("/");
  }, [cu]);

  return (
    <form
      className="sign-up"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitting");
        axios
          .post(`${server}/sign-in`, {
            userId: e.target.user.value,
            password: e.target.password.value,
          })
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
              setToken(res.data.token);
              if (res.data.totps) setAuths(res.data.totps);
              if (res.data.hotps) setHotps(res.data.hotps);
              console.log(res.data.hotps);

              navigate("/");
            }
          });
      }}
    >
      <h3>SignIn </h3>
      <input type="text" name="user" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button>Submit</button>

      <p>
        <Link to="/signup">Create Account</Link>
      </p>

      <GoogleSignin />
    </form>
  );
}
