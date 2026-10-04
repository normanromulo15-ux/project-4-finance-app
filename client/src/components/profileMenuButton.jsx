import { useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer md:text-xl"
      onClick={() => {
        navigate("/profile");
      }}
    >
      <div className="lg:hidden">
        <AccountCircleIcon />
      </div>
      <p className="font-semibold lg:font-normal">Profile</p>
    </button>
  );
}
