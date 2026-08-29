import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatCurrentTime } from "../utils/formatCurrentTime.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";
import LogoutButton from "../components/logoutButton.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  const [spendingBalanceVisibility, setSpendingBalanceVisibility] =
    useState(false);
  const { cash, eWallet, savings } = useLoaderData().userBalances;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTime(formatCurrentTime());
    setSpendingBalance(addCashAndeWalletBalance());
    setCashBalance(formatCurrency(cash.latestAccountBalance));
    setEWalletBalance(formatCurrency(eWallet.latestAccountBalance));
    setSavingsBalance(formatCurrency(savings.latestAccountBalance));
    setAccountBalances([
      { accountType: "cash", balance: cashBalance },
      { accountType: "eWallet", balance: eWalletBalance },
      { accountType: "savings", balance: savingsBalance },
    ]);
  }, [spendingBalance, savingsBalance]);

  // Function to handle the visibility of the spending balance
  function handleSpendingBalanceVisibility() {
    setSpendingBalanceVisibility((prev) => !prev);
    console.log(accountBalances);
  }

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
    <main className="relative h-dvh flex flex-col justify-start gap-12 p-8">
      <section className="w-full flex flex-col border border-t-8 border-[#2830c9] rounded-2xl px-3 py-2 gap-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <h1>SPENDING BALANCE AS OF {currentTime}:</h1>
          {spendingBalanceVisibility ? (
            <VisibilityIcon
              onClick={handleSpendingBalanceVisibility}
              sx={{ scale: 0.85 }}
            />
          ) : (
            <VisibilityOffIcon
              onClick={handleSpendingBalanceVisibility}
              sx={{ scale: 0.85 }}
            />
          )}
        </div>

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
      <section>
        <h3 className="font-bold text-2xl pl-2 mb-4">Accounts</h3>
        <div className="grid grid-cols-2 gap-3">
          {accountBalances.map((e, i) => {
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
                key={i}
              >
                <div className="flex items-center justify-start text-xl font-semibold gap-2">
                  {AccountIcon}
                  <h3>{accountName}</h3>
                </div>
                <h4 className="overflow-hidden font-bold text-lg">
                  {accountBalance}
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
