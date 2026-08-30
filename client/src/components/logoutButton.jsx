import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/auth.js";
import LogoutConfirmation from "./overlays/logoutConfirmation.jsx";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function LogoutButton() {
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
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <button
        className="cursor-pointer absolute right-3 bottom-4 text-black scale-95"
        onClick={handleShowLogoutConfirmation}
      >
        <ExitToAppIcon />
      </button>
      {showLogoutConfirmation && (
        <LogoutConfirmation
          handleShowLogoutConfirmation={handleShowLogoutConfirmation}
          handleUserLogout={handleUserLogout}
        />
      )}
    </>
  );
}
