import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/app.js";

export default function LogoutButton() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    !isLoggedIn && navigate("/login");
  }, [isLoggedIn]);

  // Function to handle user logout
  async function handleUserLogout() {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      console.log("Logout successful");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      className="bg-red-500 text-white text-lg font-medium rounded-4xl px-4 py-2 absolute right-4 top-4"
      onClick={handleUserLogout}
    >
      Logout
    </button>
  );
}
