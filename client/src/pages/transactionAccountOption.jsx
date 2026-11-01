import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
import BackButton from "../components/backButton.jsx";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AccountOption() {
  const navigate = useNavigate();
  const { userAccountsData } = useLoaderData();
  const { transactionType } = useParams();
  const theme = localStorage.getItem("theme") || "light";
  const selectedTransactionAccount = sessionStorage.getItem(
    "selectedTransactionAccount",
  );
  const [accountChoice, setAccountChoice] = useState(
    selectedTransactionAccount,
  );
  const spendingBalances = userAccountsData
    .filter((account) => account.accountType !== "savings")
    .map((account) => {
      const { accountType } = account;
      let label;
      let icon;
      switch (accountType) {
        case "cash":
          label = "Cash";
          icon = <AttachMoneyIcon />;
          break;
        case "eWallet":
          label = "E-Wallet";
          icon = <CreditCardIcon />;
          break;
      }
      return {
        account: accountType,
        balance: formatCurrency(account.latestAccountBalance),
        label,
        icon,
      };
    });

  // Function to handle the user's choice of account
  function handleAccountChoice(e) {
    const { value } = e.currentTarget;
    sessionStorage.setItem("selectedTransactionAccount", value);
    setAccountChoice(value);
  }

  // Function to handle the account navigation due to a click of the next button
  function handleClickNextButton() {
    navigate(`/transaction/${transactionType}/${accountChoice}`);
  }

  return (
    <>
      <main
        className={`min-h-dvh flex flex-col gap-8 items-center px-8 pb-8 pt-40 md:px-25 md:pt-60 md:pb-16 md:gap-14 lg:py-12 lg:justify-center lg:items-center lg:gap-20 ${theme === "dark" && "bg-gray-950 text-white"}`}
      >
        <h1 className="text-3xl font-bold md:text-5xl">Select an account:</h1>
        <div className="w-full flex flex-col gap-8 items-center md:gap-10 lg:flex-row lg:w-1/2">
          {spendingBalances.map((item) => {
            const { account, balance, label, icon } = item;
            return (
              <button
                key={account}
                className={`transition-all duration-75 cursor-pointer relative w-full flex gap-2 items-center border border-t-4 border-[#2830c9] rounded-xl px-2 py-4 ${accountChoice === account ? (theme === "dark" ? "scale-105 bg-gray-800" : "scale-105 bg-gray-200") : theme === "dark" && "bg-gray-900"}`}
                name={account}
                value={account}
                onClick={handleAccountChoice}
              >
                {accountChoice === account && (
                  <div className="absolute top-1 right-2 scale-125">
                    <CheckCircleIcon />
                  </div>
                )}
                <div>{icon}</div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="w-full text-lg text-left font-bold pb-1 border-b md:text-2xl">
                    {label}
                  </h2>
                  <h3 className="w-full text-sm text-left mt-2 md:text-xl">
                    AVAILABLE BALANCE:{" "}
                    <span className="font-semibold">{balance}</span>
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
        <button
          className={`transition-all duration-75 cursor-pointer w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:cursor-not-allowed md:text-xl md:py-3 lg:mt-0 lg:w-1/4 ${accountChoice && "active:scale-95"} ${theme === "dark" ? "hover:bg-[#363ED6] disabled:bg-gray-400" : "hover:bg-[#2228A8] disabled:bg-gray-300"}`}
          disabled={!accountChoice}
          onClick={handleClickNextButton}
        >
          Next
        </button>
      </main>
      <BackButton endpoint={"/"} page={"transactionAccountOption"} />
    </>
  );
}
