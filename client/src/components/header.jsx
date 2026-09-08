import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { formatCurrentTime } from "../utils/formatCurrentTime.js";
import BalanceVisibility from "./balanceVisibility.jsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Header(props) {
  const { cash, eWallet, formatCurrency } = props;
  const [currentTime, setCurrentTime] = useState(null);
  const [balanceVisibility, setBalanceVisibility] = useState(true);
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
    setBalanceVisibility((prev) => !prev);
  }

  // Function to handle the transaction
  function handleTransaction(e) {
    const { name } = e.currentTarget;
    navigate(`/${name}`);
  }

  return (
    <header className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-3 py-2 gap-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <h1>SPENDING BALANCE AS OF {currentTime}:</h1>
        <BalanceVisibility
          balance={"spending"}
          balanceVisibility={balanceVisibility}
          handleBalanceVisibility={handleBalanceVisibility}
        />
      </div>
      <h2 className="font-bold text-3xl">
        {balanceVisibility ? spendingBalance : "₱·····"}
      </h2>
      <div className="flex items-center justify-center gap-4">
        <button
          className="cursor-pointer flex flex-1 flex-col justify-center items-center text-white bg-[#2830c9] border rounded-xl py-2"
          name="credit"
          value="credit"
          onClick={handleTransaction}
        >
          <AddIcon />
          <p className="text-sm font-medium">Save</p>
        </button>
        <button
          className="cursor-pointer flex flex-1 flex-col justify-center items-center text-[#2830c9] border rounded-xl py-2"
          name="debit"
          value="debit"
          onClick={handleTransaction}
        >
          <RemoveIcon />
          <p className="text-sm font-medium">Spend</p>
        </button>
      </div>
    </header>
  );
}
