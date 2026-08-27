import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatCurrentTime } from "../utils/formatCurrentTime.js";
import { formatTimestamp } from "../utils/formatTimestamp.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SavingsIcon from "@mui/icons-material/Savings";
import LogoutButton from "../components/logoutButton.jsx";

export default function Home() {
  const [currentDateAndTime, setCurrentDateAndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const { cash, eWallet, savings } = useLoaderData().userBalances;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentDateAndTime(
      formatTimestamp(savings.latestAccountBalanceTimestamp).toUpperCase(),
    );
    setCurrentTime(formatCurrentTime());
    setSpendingBalance(addCashAndeWalletBalance());
    setSavingsBalance(formatCurrency(savings.latestAccountBalance));
  }, [spendingBalance, savingsBalance]);

  // Function to add the cash and the eWallet balance
  function addCashAndeWalletBalance() {
    const cashBalance = cash.latestAccountBalance;
    const eWalletBalance = eWallet.latestAccountBalance;
    const totalBalance = cashBalance + eWalletBalance;

    return formatCurrency(totalBalance);
  }

  // Function to handle the transaction
  function handleTransaction(e) {
    const { name } = e.currentTarget;
    navigate(`/${name}`);
  }

  return (
    <main className="relative h-dvh flex flex-col justify-start px-8 pt-8 gap-8">
      <section className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-4 py-2 gap-2">
        <h1 className="text-xs font-medium">
          SPENDING BALANCE AS OF {currentTime}:
        </h1>
        <h2 className="font-bold text-3xl">{spendingBalance}</h2>
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
      </section>
      <section className="w-full border border-t-4 border-[#2830c9] rounded-2xl p-4 ">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <SavingsIcon />
          <h3 className="flex-1">Savings</h3>
        </div>
        <h4 className="text-xs font-medium mt-1 mb-2">
          BALANCE AS OF {currentDateAndTime}:
        </h4>
        <h5 className="font-bold text-2xl">{savingsBalance}</h5>
      </section>
      <LogoutButton />
    </main>
  );
}
