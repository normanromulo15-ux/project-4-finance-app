import { useNavigate } from "react-router";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export default function FundTransfer() {
  const navigate = useNavigate();
  return (
    <button
      className="transition-all duration-200 active:scale-90 hover:bg-blue-50 border-b-3 border-transparent hover:border-[#2830c9] flex flex-col items-center justify-center cursor-pointer px-3 py-1 md:text-xl"
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
