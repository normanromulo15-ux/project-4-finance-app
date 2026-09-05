import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import BackButton from "../components/backButton.jsx";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AccountOption() {
  const [accountChoice, setAccountChoice] = useState(null);
  const { cash, eWallet } = useLoaderData();
  const navigate = useNavigate();
  const { transactionType } = useParams();

  const displayCashBalance = formatCurrency(cash.latestAccountBalance);
  const displayDigitalWalletBalance = formatCurrency(
    eWallet.latestAccountBalance,
  );

  // Function to handle the user's choice of account
  function handleAccountChoice(e) {
    const { value } = e.currentTarget;
    setAccountChoice(value);
  }

  // Function to handle the account navigation due to a click of the next button
  function handleNextButtonClick() {
    navigate(`/${transactionType}/${accountChoice}`);
  }

  return (
    <>
      <main
        className="h-dvh flex flex-col gap-8 items-center justify-center px-8 pb-8 pt-40
  md:px-16
  "
      >
        <h1 className="text-3xl font-bold">Select an account:</h1>
        <button
          className={`relative w-full flex gap-2 items-center border border-t-4 border-[#2830c9] rounded-xl px-2 py-4  
      ${accountChoice === "cash" && "scale-105"}`}
          name="cash"
          value="cash"
          onClick={handleAccountChoice}
        >
          {accountChoice === "cash" && (
            <div className="absolute top-1 right-2 scale-125">
              <CheckCircleIcon />
            </div>
          )}
          <AttachMoneyIcon />
          <div className="flex flex-col items-start flex-1">
            <h2 className="text-lg text-left font-medium border-b w-full">
              Cash
            </h2>
            <h3 className="text-sm text-left font-medium w-full mt-1">
              AVAILABLE BALANCE: <span>{displayCashBalance}</span>
            </h3>
          </div>
        </button>
        <button
          className={`relative w-full flex gap-2 items-center border border-t-4 border-[#2830c9] rounded-xl px-2 py-4 
      ${accountChoice === "eWallet" && "scale-105"}`}
          name="eWallet"
          value="eWallet"
          onClick={handleAccountChoice}
        >
          {accountChoice === "eWallet" && (
            <div className="absolute top-1 right-2 scale-125">
              <CheckCircleIcon />
            </div>
          )}
          <CreditCardIcon />
          <div className="flex flex-col items-start flex-1">
            <h2 className="text-lg text-left font-medium border-b w-full">
              Digital Wallet
            </h2>
            <h3 className="text-sm text-left font-medium w-full mt-1">
              AVAILABLE BALANCE: <span>{displayDigitalWalletBalance}</span>
            </h3>
          </div>
        </button>
        <button
          className="w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!accountChoice}
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </main>
      <BackButton endpoint={"/"} />
    </>
  );
}
