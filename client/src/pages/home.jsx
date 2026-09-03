import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatCurrentTime } from "../utils/formatCurrentTime.js";
import { addDailyInterest } from "../services/app.js";
import BalanceVisibility from "../components/balanceVisibility.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(null);
  const [cashBalance, setCashBalance] = useState(null);
  const [eWalletBalance, setEWalletBalance] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(null);
  const [spendingBalance, setSpendingBalance] = useState(null);
  const [accountBalances, setAccountBalances] = useState([
    { accountType: "cash", balance: null },
    { accountType: "eWallet", balance: null },
    { accountType: "savings", balance: null },
  ]);
  const [balanceVisibility, setBalanceVisibility] = useState(true);
  const { cash, eWallet, savings } = useLoaderData().userBalances;
  const navigate = useNavigate();

  useEffect(() => {
    async function addInterestToSavings() {
      return await addDailyInterest();
    }
    addInterestToSavings();
  }, []);

  useEffect(() => {
    setCurrentTime(formatCurrentTime());
    setCashBalance(formatCurrency(cash.latestAccountBalance));
    setEWalletBalance(formatCurrency(eWallet.latestAccountBalance));
    setSavingsBalance(formatCurrency(savings.latestAccountBalance));
    setAccountBalances([
      { accountType: "cash", balance: cashBalance },
      { accountType: "eWallet", balance: eWalletBalance },
      { accountType: "savings", balance: savingsBalance },
    ]);
    setSpendingBalance(addCashAndEWalletBalance());
  }, [spendingBalance, savingsBalance]);

  // Function to handle the visibility of a balance
  function handleBalanceVisibility() {
    setBalanceVisibility((prev) => !prev);
  }

  // Function to add the cash and the eWallet balance
  function addCashAndEWalletBalance() {
    const cashBalance = cash.latestAccountBalance;
    const eWalletBalance = eWallet.latestAccountBalance;
    const totalBalance = Number(cashBalance + eWalletBalance);

    return formatCurrency(totalBalance);
  }

  // Function to handle the transaction
  function handleTransaction(e) {
    const { name } = e.currentTarget;
    navigate(`/${name}`);
  }

  return (
    <main className="relative h-dvh flex flex-col justify-start gap-6 p-8">
      <section className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-3 py-2 gap-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <h1>SPENDING BALANCE AS OF {currentTime}:</h1>
          <BalanceVisibility
            balance={"spending"}
            balanceVisibility={balanceVisibility}
            handleBalanceVisibility={handleBalanceVisibility}
          />
        </div>
        <h2 className="font-bold text-3xl">
          {!balanceVisibility ? "₱·····" : spendingBalance}
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
      </section>
      <section>
        <div className="flex flex-col justify-center gap-1 px-2 pb-2 mb-4 border-b-2">
          <h3 className="font-bold text-2xl ">Accounts</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {accountBalances.map((e) => {
            let accountName;
            let accountBalance;
            let AccountIcon;

            switch (e.accountType) {
              case "cash":
                accountName = "Cash";
                accountBalance = e.balance;
                AccountIcon = <MoneyIcon />;
                break;
              case "eWallet":
                accountName = "E-Wallet";
                accountBalance = e.balance;
                AccountIcon = <WalletIcon />;
                break;
              case "savings":
                accountName = "Savings";
                accountBalance = e.balance;
                AccountIcon = <SavingsIcon />;
                break;
            }

            return (
              <div
                className="flex flex-col gap-2 border border-t-4 border-[#2830c9] rounded-2xl p-4"
                key={e.accountType}
              >
                <div className="flex items-center justify-start text-xl font-semibold gap-2">
                  {AccountIcon}
                  <h3>{accountName}</h3>
                </div>
                <h4 className="overflow-hidden font-bold text-lg">
                  {!balanceVisibility ? "₱·····" : accountBalance}
                </h4>
              </div>
            );
          })}
        </div>
      </section>

      <LogoutButton />
    </main>
  );
}
