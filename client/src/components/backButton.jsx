import { useNavigate } from "react-router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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
      className="cursor-pointer fixed left-4 top-6 md:left-8 md:top-8"
      onClick={handleBackNavigation}
    >
      <ArrowBackIosNewIcon />
    </button>
  );
}
