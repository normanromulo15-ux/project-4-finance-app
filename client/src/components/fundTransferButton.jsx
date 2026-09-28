import { useNavigate } from "react-router";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export default function FundTransfer() {
  const navigate = useNavigate();
  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer md:text-xl"
      onClick={() => {
        navigate("/transfer");
      }}
    >
      <CurrencyExchangeIcon />
      <p className="font-semibold border-b-2">Transfer</p>
    </button>
  );
}
