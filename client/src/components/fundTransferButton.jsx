import { useNavigate } from "react-router";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export default function FundTransfer() {
  const navigate = useNavigate();
  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer px-2 hover:bg-gray-400 md:text-xl"
      onClick={() => {
        navigate("/transfer");
      }}
    >
      <div className="lg:hidden">
        <CurrencyExchangeIcon />
      </div>
      <p className="font-semibold lg:font-normal">Transfer</p>
    </button>
  );
}
