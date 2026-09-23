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
      }, 1000);
    }
  }

  return (
    <div className="h-dvh flex flex-col justify-between">
      <header className="bg-[#2830c9] text-white flex flex-col items-center p-6">
        <h1 className="text-3xl md:text-5xl">Finances</h1>
      </header>
      <main className="px-10 md:px-30">
        <section className="flex flex-col gap-2">
          <form
            className="relative flex flex-col justify-center gap-4 md:text-lg"
            onSubmit={handleUserCredentialsSubmission}
          >
            <input
              className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
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
              className={`relative border ${incorrectCredentials ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-100"}  py-2 px-3 rounded-lg flex`}
            >
              <input
                className="flex-1"
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
                <VisibilityIcon
                  className="scale-85"
                  onClick={handleShowPassword}
                />
              )}
            </div>
            {incorrectCredentials && (
              <p className="text-red-600 text-center font-semibold text-sm">
                Incorrect email or password.
              </p>
            )}

            <button className="flex justify-center items-center bg-[#2830c9] rounded-lg p-2 text-white  font-medium ">
              <p>Sign In</p>
            </button>
          </form>
          <p className="text-center text-sm md:text-base">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
