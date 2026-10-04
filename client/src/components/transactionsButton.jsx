import { useNavigate } from "react-router";
import HistoryIcon from "@mui/icons-material/History";

export default function TransactionButton() {
  const navigate = useNavigate();
  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer md:text-xl"
      onClick={() => {
        navigate("/transactions");
      }}
    >
      <div className="lg:hidden">
        <HistoryIcon />
      </div>
      <p className="font-semibold lg:font-normal">Transactions</p>
    </button>
  );
}
