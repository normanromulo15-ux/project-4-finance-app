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
  const [isAccountExists, setIsAccountExists] = useState(true);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isEnableSignIn, setIsEnableSignIn] = useState(false);
  const navigate = useNavigate();
  const { email, password } = userCredentials;

  useEffect(() => {
    accessToken && navigate("/");
  }, [accessToken]);

  // Hook to dynamically enable the sign-in button if the required conditions are met
  useEffect(() => {
    setIsEnableSignIn(email && password.length >= 8);
  }, [email, password]);

  // Handle the user credentials input
  function handleUserCredentialsInput(e) {
    const { name, value } = e.target;
    setUserCredentials((prev) => ({ ...prev, [name]: value }));
  }

  // Handle show password
  function handleShowPassword() {
    setIsShowPassword((prev) => !prev);
  }

  // Handle user credentials submission
  async function handleUserCredentialsSubmission(e) {
    try {
      e.preventDefault();
      const { accessToken } = await loginUser(userCredentials);
      api.accessToken = accessToken;
      setAccessToken(accessToken);
      setUserCredentials({
        email: "",
        password: "",
      });
    } catch (error) {
      const errorStatusCode = error.response?.status;
      switch (errorStatusCode) {
        case 401:
          setIsIncorrectPassword(true);
          setIsEnableSignIn(false);
          break;
        case 404:
          setIsAccountExists(false);
          break;
      }
      setTimeout(() => {
        setIsAccountExists(true);
        setIsIncorrectPassword(false);
        setIsEnableSignIn(true);
      }, 2000);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col justify-between items-center">
      <header className="bg-[#2830c9] text-white w-full flex flex-col items-center p-6">
        <h1 className="text-3xl md:text-5xl">Finances</h1>
      </header>
      <main className="w-4/5 md:w-2/3 lg:w-1/4">
        <section className="flex flex-col gap-2">
          <form
            className="relative flex flex-col justify-center gap-4 md:text-lg"
            onSubmit={handleUserCredentialsSubmission}
          >
            <div className="flex flex-col gap-1">
              <input
                className={`w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:outline-2 border py-2 px-3 rounded-lg font-medium ${!isAccountExists ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-100"}`}
                type="email"
                name="email"
                value={email}
                onChange={handleUserCredentialsInput}
                placeholder="Email"
                autoFocus={true}
                required={true}
              />
              {!isAccountExists && (
                <p className="text-red-600 text-center font-semibold text-sm">
                  This account doesn't exist.
                </p>
              )}
            </div>
            <div className="relative flex flex-col gap-1">
              <input
                className={`w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:outline-2 font-medium border ${isIncorrectPassword ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-100"} py-2 px-3 rounded-lg flex`}
                type={isShowPassword ? "text" : "password"}
                minLength={8}
                name="password"
                value={password}
                onChange={handleUserCredentialsInput}
                placeholder="Password"
                required={true}
              />
              {isIncorrectPassword && (
                <p className="text-red-600 text-center font-semibold text-sm">
                  The password you entered is incorrect.
                </p>
              )}
              <div className="absolute top-1.5 right-2 cursor-pointer active:scale-95">
                {isShowPassword ? (
                  <VisibilityIcon
                    className="scale-85"
                    onClick={handleShowPassword}
                  />
                ) : (
                  <VisibilityOffIcon
                    className="scale-85"
                    onClick={handleShowPassword}
                  />
                )}
              </div>
            </div>

            <button
              className={`transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center bg-[#2830c9] rounded-full p-2 text-white font-medium ${isEnableSignIn && "active:scale-95"}`}
              disabled={!isEnableSignIn}
            >
              <p>Sign In</p>
            </button>
          </form>
          <p className="text-center text-sm md:text-base">
            Don't have an account?{" "}
            <span
              className="transition-all duration-75 hover:underline cursor-pointer font-semibold text-[#2830c9]"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register here.
            </span>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
