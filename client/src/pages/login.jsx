import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router";
import { loginUser } from "../services/auth.js";
import api from "../services/api.js";
import Footer from "../components/footer.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const { accessToken, setAccessToken } = useAuth();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { email, password } = userCredentials;

  useEffect(() => {
    api.accessToken = accessToken;
    accessToken && navigate("/");
  }, [accessToken]);

  // Handle the user credentials input
  function handleUserCredentialsInput(e) {
    const { name, value } = e.target;

    setUserCredentials((prev) => ({ ...prev, [name]: value }));
  }

  // Handle show password
  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  // Handle user credentials submission
  async function handleUserCredentialsSubmission(e) {
    e.preventDefault();
    try {
      const response = await loginUser(userCredentials);
      setAccessToken(response.accessToken);
      setUserCredentials({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setIncorrectCredentials(true);
      setTimeout(() => {
        setIncorrectCredentials(false);
      }, 800);
    }
  }

  return (
    <div className="h-dvh flex flex-col">
      <header className="bg-[#2830c9] text-white flex flex-col items-center gap-2 p-6">
        <h1 className="text-3xl">Finances</h1>
      </header>
      <form
        className="relative flex flex-col flex-1 justify-center px-10 gap-4"
        onSubmit={handleUserCredentialsSubmission}
      >
        <input
          className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-sm"
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={handleUserCredentialsInput}
          placeholder="Email"
          autoFocus={true}
          autoComplete="on"
          required={true}
        />
        <div
          className={`relative  border ${incorrectCredentials ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-100"}  py-2 px-3 rounded-lg flex`}
        >
          {incorrectCredentials && (
            <small className="absolute text-red-600 -top-20 text-sm font-semibold w-100">
              Incorrect email or password.
            </small>
          )}
          <input
            className="flex-1 text-sm"
            type={showPassword ? "text" : "password"}
            id="password"
            minLength={8}
            name="password"
            value={password}
            onChange={handleUserCredentialsInput}
            placeholder="Password"
            required={true}
          />
          {showPassword ? (
            <VisibilityOffIcon
              className="scale-85"
              onClick={handleShowPassword}
            />
          ) : (
            <VisibilityIcon className="scale-85" onClick={handleShowPassword} />
          )}
        </div>

        <button className="flex justify-center items-center bg-[#2830c9] rounded-lg p-2 text-white text-base font-medium ">
          <p>Sign In</p>
        </button>
        <p className="text-center text-sm ">
          Don't have an account?{" "}
          <span
            className="font-semibold text-[#2830c9]"
            onClick={() => {
              console.log("Script to redirect to the register page.");
            }}
          >
            Register here.
          </span>
        </p>
      </form>

      <Footer />
    </div>
  );
}
