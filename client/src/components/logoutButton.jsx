import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { logoutUser } from "../services/auth.js";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function LogoutButton() {
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
    <ExitToAppIcon
      className="absolute right-3 bottom-4 text-black scale-95"
      onClick={handleUserLogout}
    />
  );
}
