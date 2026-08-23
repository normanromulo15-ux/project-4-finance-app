import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton(props) {
  const { endpoint } = props;
  const navigate = useNavigate();

  // Function to handle back navigation
  function handleBackNavigation() {
    navigate(endpoint);
  }

  return (
    <button className="absolute left-4 top-4" onClick={handleBackNavigation}>
      <ArrowBackIcon />
    </button>
  );
}
