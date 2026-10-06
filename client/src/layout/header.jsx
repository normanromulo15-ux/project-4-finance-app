import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { formatCurrentTime } from "../utils/formatters.js";

// Components
import BalanceVisibility from "../components/balanceVisibility.jsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Header(props) {
  const defaultBalanceVisibility = localStorage.getItem(
    "spendingBalanceVisibility",
  );
  const { cash, eWallet, formatCurrency } = props;
  const [currentTime, setCurrentTime] = useState(null);
  const [balanceVisibility, setBalanceVisibility] = useState(
    Boolean(defaultBalanceVisibility),
  );
  const [spendingBalance, setSpendingBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTime(formatCurrentTime());
  }, []);

  useEffect(() => {
    setSpendingBalance(addCashAndEWalletBalance());
  }, [spendingBalance]);

  // Function to add the cash and the eWallet balance
  function addCashAndEWalletBalance() {
    const cashBalance = cash.latestAccountBalance;
    const eWalletBalance = eWallet.latestAccountBalance;
    const totalBalance = Number(cashBalance + eWalletBalance);

    return formatCurrency(totalBalance);
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
  function handleTransaction(e) {
    const { name } = e.currentTarget;
    navigate(`/transaction/${name}`);
  }

  return (
    <header className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-4 py-2 gap-2 md:gap-3 lg:px-10 lg:py-20   lg:justify-around lg:border-3 lg:border-t-10 lg:rounded-3xl">
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
      <div className="flex items-center justify-center gap-4 md:gap-15 lg:gap-20">
        <button
          className="transition-all duration-200 cursor-pointer active:scale-95 hover:bg-[#2228A8] flex flex-1 flex-col justify-center items-center text-white bg-[#2830c9] rounded-xl py-2 lg:py-4 lg:rounded-2xl"
          name="credit"
          value="credit"
          onClick={handleTransaction}
        >
          <AddIcon />
          <p className="text-sm font-medium lg:text-xl">Income</p>
        </button>
        <button
          className="transition-all duration-200 cursor-pointer active:scale-95 hover:bg-[#2228A8] flex flex-1 flex-col justify-center items-center text-white bg-[#2830c9] rounded-xl py-2 lg:py-4 lg:rounded-2xl"
          name="debit"
          value="debit"
          onClick={handleTransaction}
        >
          <RemoveIcon />
          <p className="text-sm font-medium lg:text-xl">Expense</p>
        </button>
      </div>
    </header>
  );
}
