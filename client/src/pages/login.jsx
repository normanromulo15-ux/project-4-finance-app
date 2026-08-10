import { useContext, useState } from "react";
import { AuthContext } from "../hooks/authContext.jsx";
import api from "../services/api.js";

export default function Login() {
  const { setAccessToken } = useContext(AuthContext);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [enableLogin, setEnableLogin] = useState(false);

  const { email, password } = userCredentials;

  // Handle the user credentials input
  function handleUserCredentialsInput(e) {
    const { name, value } = e.target;

    setUserCredentials((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "password":
        setEnableLogin(value.length >= 8);
        console.log(enableLogin);
        break;
    }
  }

  // Handle user credentials submission
  async function handleUserCredentialsSubmission(e) {
    e.preventDefault();
    try {
      const response = api.post("/auth/login", userCredentials);
      setAccessToken(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-dvh flex flex-col">
      <header className="bg-[#2830c9] text-white flex flex-col items-center gap-2 p-6">
        <h1 className="text-3xl">Login Page</h1>
      </header>
      <form
        className="flex flex-col justify-center flex-1 px-14 gap-4"
        onSubmit={handleUserCredentialsSubmission}
      >
        <input
          className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-3xl text-sm"
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={handleUserCredentialsInput}
          placeholder="Email"
        />
        <input
          className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-3xl text-sm"
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={password}
          onChange={handleUserCredentialsInput}
          placeholder="Password"
        />
        <button className="bg-[#2830c9] rounded-3xl p-2 text-white text-base font-medium">
          Login
        </button>
      </form>
      <footer className="bg-[#292933] flex items-center justify-center py-2">
        <p className="text-xs text-white">Made by React, 2026</p>
      </footer>
    </div>
  );
}
