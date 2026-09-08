import { useState, useEffect } from "react";
import BalanceVisibility from "./balanceVisibility.jsx";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";

export default function Accounts(props) {
  const { cash, eWallet, savings, formatCurrency } = props;

  const [accountBalances, setAccountBalances] = useState([
    { accountType: "cash", balance: null },
    { accountType: "eWallet", balance: null },
    { accountType: "savings", balance: null },
  ]);
  const [balanceVisibility, setBalanceVisibility] = useState(true);

  useEffect(() => {
    setAccountBalances([
      {
        accountType: "cash",
        balance: formatCurrency(cash.latestAccountBalance),
      },
      {
        accountType: "eWallet",
        balance: formatCurrency(eWallet.latestAccountBalance),
      },
      {
        accountType: "savings",
        balance: formatCurrency(savings.latestAccountBalance),
      },
    ]);
  }, []);

  // Function to handle the visibility of a balance
  function handleBalanceVisibility() {
    setBalanceVisibility((prev) => !prev);
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
          const accountBalance = e.balance;
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
              key={e.accountType}
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
