import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
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
    navigate(`/transaction/${transactionType}/${accountChoice}`);
  }

  return (
    <>
      <main className="min-h-dvh flex flex-col gap-8 items-center px-8 pb-8 pt-40 md:px-25 md:pt-60 md:pb-16 md:gap-14 lg:py-12 lg:justify-center lg:items-center lg:gap-20">
        <h1 className="text-3xl font-bold md:text-5xl">Select an account:</h1>
        <div className="w-full flex flex-col gap-8 items-center md:gap-10 lg:flex-row lg:w-1/2">
          <button
            className={`transition-all duration-75 cursor-pointer relative w-full flex gap-2 items-center border border-t-4 border-[#2830c9] rounded-xl px-2 py-4 ${accountChoice === "cash" && "scale-105 bg-gray-100"}`}
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
              <h2 className="w-full text-lg text-left font-bold pb-1 border-b md:text-2xl">
                Cash
              </h2>
              <h3 className="w-full text-sm text-left mt-2 md:text-xl">
                AVAILABLE BALANCE:
                <span className="font-semibold">{displayCashBalance}</span>
              </h3>
            </div>
          </button>
          <button
            className={`transition-all duration-75 cursor-pointer relative w-full flex gap-2 items-center border border-t-4 border-[#2830c9] rounded-xl px-2 py-4 ${accountChoice === "eWallet" && "scale-105 bg-gray-100"}`}
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
            <div className="flex flex-col items-start flex-1 ">
              <h2 className="w-full text-lg text-left font-bold pb-1 border-b md:text-2xl">
                Digital Wallet
              </h2>
              <h3 className="w-full text-sm text-left mt-2 md:text-xl">
                AVAILABLE BALANCE:{" "}
                <span className="font-semibold">
                  {displayDigitalWalletBalance}
                </span>
              </h3>
            </div>
          </button>
        </div>

        <button
          className="transition-all duration-75 cursor-pointer active:scale-95 hover:bg-[#2228A8] w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:bg-gray-300 disabled:cursor-not-allowed md:text-xl md:py-3 lg:mt-0 lg:w-1/4"
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
