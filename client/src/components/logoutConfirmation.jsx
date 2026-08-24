import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/auth.js";

export default function LogoutConfirmation() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  // Function to handle user logout
  async function handleUserLogout() {
    try {
      await logoutUser();
      setAccessToken(null);
      navigate("/login");
      console.log("Logout successful");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-dvh bg-black/70 fixed inset-0 z-10">
      <div className="z-20">Are you sure you want to logout?</div>
      <button>Cancel</button>
      <button onClick={handleUserLogout}>Logout</button>
    </div>
  );
}
