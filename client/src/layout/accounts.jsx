import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import BalanceVisibility from "../components/balanceVisibility.jsx";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";

export default function Accounts(props) {
  const accountsBalanceVisibility = localStorage.getItem(
    "accountsBalanceVisibility",
  );
  const { cash, eWallet, savings, formatCurrency } = props;
  const [cashBalance, setCashBalance] = useState(null);
  const [eWalletBalance, setEWalletBalance] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(null);
  const [accountBalances, setAccountBalances] = useState([
    { accountType: "cash", balance: null },
    { accountType: "eWallet", balance: null },
    { accountType: "savings", balance: null },
  ]);
  const [balanceVisibility, setBalanceVisibility] = useState(
    Boolean(accountsBalanceVisibility),
  );
  const navigate = useNavigate();

  useEffect(() => {
    setCashBalance(formatCurrency(cash.latestAccountBalance));
  }, [cashBalance]);

  useEffect(() => {
    setEWalletBalance(formatCurrency(eWallet.latestAccountBalance));
  }, [eWalletBalance]);

  useEffect(() => {
    setSavingsBalance(formatCurrency(savings.latestAccountBalance));
  }, [savingsBalance]);

  useEffect(() => {
    setAccountBalances([
      {
        accountType: "cash",
        balance: cashBalance,
      },
      {
        accountType: "eWallet",
        balance: eWalletBalance,
      },
      {
        accountType: "savings",
        balance: savingsBalance,
      },
    ]);
  }, [cashBalance, eWalletBalance, savingsBalance]);

  // Function to handle the visibility of a balance
  function handleBalanceVisibility() {
    setBalanceVisibility((prev) => {
      switch (prev) {
        case true:
          localStorage.setItem("accountsBalanceVisibility", "");
          return false;
        case false:
          localStorage.setItem("accountsBalanceVisibility", "Yes");
          return true;
      }
    });
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center px-2 pb-2 mb-4 border-b-2">
        <h3 className="font-bold text-2xl ">Accounts</h3>
        <BalanceVisibility
          balance={"allAccounts"}
          balanceVisibility={balanceVisibility}
          handleBalanceVisibility={handleBalanceVisibility}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {accountBalances.map((e) => {
          const { accountType, balance: accountBalance } = e;
          let accountName;
          let AccountIcon;

          switch (e.accountType) {
            case "cash":
              accountName = "Cash";
              AccountIcon = <MoneyIcon />;
              break;
            case "eWallet":
              accountName = "E-Wallet";
              AccountIcon = <WalletIcon />;
              break;
            case "savings":
              accountName = "Savings";
              AccountIcon = <SavingsIcon />;
              break;
          }

          return (
            <div
              className="flex flex-col gap-2 border border-t-4 border-[#2830c9] rounded-2xl p-4"
              key={accountType}
              onClick={() => navigate(`/accounts/${accountType}?period=week`)}
            >
              <div className="flex items-center justify-start text-xl font-semibold gap-2">
                {AccountIcon}
                <h3>{accountName}</h3>
              </div>
              <h4 className="overflow-hidden font-bold text-lg">
                {balanceVisibility ? accountBalance : "₱·····"}
              </h4>
            </div>
          );
        })}
      </div>
    </section>
  );
}
