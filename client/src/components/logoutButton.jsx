import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/auth.js";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function LogoutButton() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

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
        className="absolute right-3 bottom-4 text-black scale-95"
        onClick={() => {
          setShowLogoutConfirmation(true);
        }}
      >
        <ExitToAppIcon />
      </button>
      {showLogoutConfirmation && (
        <main className="h-dvh bg-black/70 flex flex-col items-center justify-center fixed inset-0 z-10">
          <section className="z-20 bg-white p-4">
            <div className="text-lg">Are you sure you want to logout?</div>
            <div className="text-base flex justify-center items-center gap-6   mt-2">
              <button
                onClick={() => {
                  setShowLogoutConfirmation(false);
                }}
              >
                Cancel
              </button>
              <button onClick={handleUserLogout}>Logout</button>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
