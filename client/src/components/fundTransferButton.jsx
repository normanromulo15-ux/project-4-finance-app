import { useNavigate } from "react-router";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export default function FundTransfer() {
  const navigate = useNavigate();

  // Function to handle the navigation to the fund transfer page
  function handleFundTransferClick() {
    navigate("/transfer");
  }

  return (
    <button
      className="flex justify-center items-center px-4 py-2 gap-4 bg-[#2830c9] rounded-2xl"
      onClick={handleFundTransferClick}
    >
      <CurrencyExchangeIcon sx={{ color: "white" }} />
      <span className="text-white text-lg font-medium">Transfer Funds</span>
    </button>
  );
}
