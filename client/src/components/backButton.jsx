import { useNavigate } from "react-router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function BackButton(props) {
  const { endpoint, page } = props;
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme") || "light";

  // Function to handle back navigation
  function handleBackNavigation() {
    switch (page) {
      case "transactions":
        localStorage.removeItem("page");
        localStorage.removeItem("category");
        break;
      case "transactionAccountOption":
        sessionStorage.removeItem("selectedTransactionAccount");
    }
    navigate(endpoint);
  }

  return (
    <button
      className="transition-all duration-75 cursor-pointer active:scale-95 fixed left-4 top-6 md:left-8 md:top-8 lg:left-30 lg:top-10"
      onClick={handleBackNavigation}
    >
      <ArrowBackIosNewIcon
        sx={{ color: `${theme === "dark" ? "white" : "black"}` }}
      />
    </button>
  );
}
