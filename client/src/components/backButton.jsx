import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton(props) {
  const { endpoint, page } = props;
  const navigate = useNavigate();

  // Function to handle back navigation
  function handleBackNavigation() {
    if (page === "transactions") {
      localStorage.removeItem("page");
      localStorage.removeItem("category");
    }
    navigate(endpoint);
  }

  return (
    <button
      className="cursor-pointer fixed left-4 top-4"
      onClick={handleBackNavigation}
    >
      <ArrowBackIcon />
    </button>
  );
}
