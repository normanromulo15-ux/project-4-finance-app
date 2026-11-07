import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTransactionDetailsStore } from "../stores/transactionDetailsStore.js";
import { formatCurrentTime } from "../utils/formatters.js";

// Components
import BalanceVisibility from "../components/balanceVisibility.jsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Header(props) {
  const theme = localStorage.getItem("theme");
  const defaultBalanceVisibility =
    localStorage.getItem("spendingBalanceVisibility") ?? "Yes";
  const { spendingAccounts, formatCurrency } = props;
  const setTransactionDetails = useTransactionDetailsStore(
    (state) => state.setTransactionDetails,
  );
  const [currentTime, setCurrentTime] = useState(null);
  const [balanceVisibility, setBalanceVisibility] = useState(
    Boolean(defaultBalanceVisibility),
  );
  const [spendingBalance, setSpendingBalance] = useState(null);
  const accountChoices = [
    { label: "Income", value: "credit", icon: <AddIcon /> },
    { label: "Expense", value: "debit", icon: <RemoveIcon /> },
  ];

  useEffect(() => {
    setCurrentTime(formatCurrentTime());
  }, []);

  useEffect(() => {
    setSpendingBalance(addCashAndEWalletBalance());
  }, [spendingBalance]);

  // Function to add the cash and the eWallet balance
  function addCashAndEWalletBalance() {
    const totalSpendingBalance = spendingAccounts.reduce(
      (a, b) => a + b.latestAccountBalance,
      0,
    );
    return formatCurrency(totalSpendingBalance);
  }

  // Function to handle the visibility of a balance
  function handleBalanceVisibility() {
    setBalanceVisibility((prev) => {
      switch (prev) {
        case true:
          localStorage.setItem("spendingBalanceVisibility", "");
          return false;
        case false:
          localStorage.setItem("spendingBalanceVisibility", "Yes");
          return true;
      }
    });
  }

  // Function to handle the transaction
  function handleTransaction(name, value) {
    sessionStorage.setItem("transactionType", value);
    setTransactionDetails(name, value);
  }

  return (
    <header
      className={`w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-4 py-2 gap-2 md:gap-3 lg:px-10 lg:py-20   lg:justify-around lg:border-3 lg:border-t-10 lg:rounded-3xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      <div className="flex items-center justify-between text-xs font-medium md:text-base lg:text-xl">
        <h1>SPENDING BALANCE AS OF {currentTime}:</h1>
        <BalanceVisibility
          balance={"spending"}
          balanceVisibility={balanceVisibility}
          handleBalanceVisibility={handleBalanceVisibility}
        />
      </div>
      <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl">
        {balanceVisibility ? spendingBalance : "₱·····"}
      </h2>
      <div className="flex items-center justify-center gap-4 md:gap-15">
        {accountChoices.map((account) => {
          const { label, value, icon } = account;
          return (
            <Link
              to="/transaction/account-options"
              key={value}
              className={`transition-all duration-75 cursor-pointer active:scale-95 flex flex-1 flex-col justify-center items-center text-white bg-[#2830c9] rounded-xl py-2 lg:py-4 lg:rounded-2xl ${theme === "dark" ? "hover:bg-[#363ED6]" : "hover:bg-[#2228A8]"}`}
              onClick={() => {
                handleTransaction("type", value);
              }}
            >
              <div>{icon}</div>
              <p className="text-sm font-medium lg:text-xl">{label}</p>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
