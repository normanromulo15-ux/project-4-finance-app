import { useNavigate } from "react-router";
import HistoryIcon from "@mui/icons-material/History";

export default function TransactionButton() {
  const navigate = useNavigate();
  return (
    <button
      className="transition-all duration-200 active:scale-90 hover:bg-blue-50 border-b-3 border-transparent hover:border-[#2830c9] flex flex-col items-center justify-center cursor-pointer px-3 py-1 md:text-xl"
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
