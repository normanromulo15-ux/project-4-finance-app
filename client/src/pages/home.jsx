import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatCurrentTime } from "../utils/formatCurrentTime.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LogoutButton from "../components/logoutButton.jsx";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(null);
  const { cash, eWallet, savings } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTime(formatCurrentTime());
  }, []);

  // Function to add the cash and the eWallet balance
  function addCashAndeWalletBalance() {
    const cashBalance = cash.latestAccountBalance;
    const eWalletBalance = eWallet.latestAccountBalance;
    const totalBalance = cashBalance + eWalletBalance;

    return formatCurrency(totalBalance);
  }

  // Function to handle the transaction
  function handleTransaction(e) {
    const { value } = e.currentTarget;

    switch (value) {
      case "credit":
        console.log("Save button clicked");
        break;

      case "debit":
        navigate("/transaction");
    }
  }

  return (
    <main className="relative h-dvh flex flex-col justify-start px-8 pt-8">
      <LogoutButton />
      <section className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-4 py-2 gap-2">
        <h1 className="text-xs font-medium">
          AVAILABLE BALANCE AS OF {currentTime}:
        </h1>
        <h2 className="font-bold text-3xl">{addCashAndeWalletBalance()}</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            className="flex flex-1 flex-col justify-center items-center text-white bg-[#2830c9] border rounded-xl py-2"
            name="transaction-type"
            value="credit"
            onClick={handleTransaction}
          >
            <AddIcon />
            <p className="text-sm font-medium">Save</p>
          </button>
          <button
            className="flex flex-1 flex-col justify-center items-center text-[#2830c9] border rounded-xl py-2"
            name="transaction-type"
            value="debit"
            onClick={handleTransaction}
          >
            <RemoveIcon />
            <p className="text-sm font-medium">Spend</p>
          </button>
        </div>
      </section>
    </main>
  );
}
