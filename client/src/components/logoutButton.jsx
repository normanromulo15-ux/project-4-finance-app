import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/auth.js";
import LogoutConfirmation from "./overlays/logoutConfirmation.jsx";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogoutButton() {
  const theme = localStorage.getItem("theme") || "light";
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  // Function to handle the display of the logout confirmation
  function handleShowLogoutConfirmation() {
    setShowLogoutConfirmation((prev) => !prev);
  }

  // Function to handle user logout
  async function handleUserLogout() {
    try {
      await logoutUser();
      setAccessToken(null);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <button
        className="transition-all active:scale-95 cursor-pointer flex gap-1 items-center justify-end md:text-lg"
        onClick={handleShowLogoutConfirmation}
      >
        <LogoutIcon />
        <p className="font-medium">Logout</p>
      </button>
      {showLogoutConfirmation && (
        <LogoutConfirmation
          theme={theme}
          handleShowLogoutConfirmation={handleShowLogoutConfirmation}
          handleUserLogout={handleUserLogout}
        />
      )}
    </>
  );
}
