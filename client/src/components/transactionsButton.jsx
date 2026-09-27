import { useNavigate } from "react-router";
import HistoryIcon from "@mui/icons-material/History";

export default function TransactionButton() {
  const navigate = useNavigate();
  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer"
      onClick={() => {
        navigate("/transactions");
      }}
    >
      <HistoryIcon />
      <p className="font-semibold border-b-2">Transactions</p>
    </button>
  );
}
