import { useState, useEffect } from "react";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function NewUserSetupAccountsChoice() {
  const [isAccountSelected, setIsAccountSelected] = useState({
    cash: false,
    eWallet: false,
    savings: false,
  });
  const {
    cash: isSelectCash,
    eWallet: isSelectEWallet,
    savings: isSelectSavings,
  } = isAccountSelected;
  const isEnableContinue = isSelectCash || isSelectEWallet || isSelectSavings;
  const [isSelectAllAccount, setIsSelectAllAccount] = useState(false);
  const accounts = [
    { label: "Cash", icon: <MoneyIcon />, name: "cash" },
    { label: "E-Wallet", icon: <WalletIcon />, name: "eWallet" },
    { label: "Savings", icon: <SavingsIcon />, name: "savings" },
  ];

  useEffect(() => {
    switch (isSelectAllAccount) {
      case true:
        setIsAccountSelected({
          cash: true,
          eWallet: true,
          savings: true,
        });
        break;
      default:
        setIsAccountSelected({
          cash: false,
          eWallet: false,
          savings: false,
        });
        break;
    }
  }, [isSelectAllAccount]);

  useEffect(() => {
    setIsSelectAllAccount(isSelectCash && isSelectEWallet && isSelectSavings);
  }, [isAccountSelected]);

  // Function to handle the selection of account choices
  function handleSelectAccountChoice(e) {
    const { name } = e.currentTarget;
    setIsAccountSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  // Function to handle the selection of all accounts
  function handleSelectAllAccounts() {
    setIsSelectAllAccount((prev) => !prev);
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center gap-8 p-8">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-xl font-medium">
          Select at least one account that you have.
        </h1>
      </header>
      <main className="w-full flex flex-col gap-4">
        <div className="self-end flex items-center gap-1 pr-2">
          <h2 className="font-medium">Select All</h2>
          <button
            className="transition-all duration-75 active:scale-95"
            onClick={handleSelectAllAccounts}
          >
            {isSelectAllAccount ? (
              <CheckBoxIcon />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )}
          </button>
        </div>
        <ul className="flex flex-col gap-4">
          {accounts.map((account) => {
            const { label, icon, name } = account;
            return (
              <li key={name}>
                <button
                  type="button"
                  className="transition-all duration-75 active:scale-95 w-full border-2 px-2 py-4 rounded-md flex justify-between items-center"
                  name={name}
                  onClick={handleSelectAccountChoice}
                >
                  <div className="flex gap-1">
                    <div>{icon}</div>
                    <h3 className="font-medium text-lg">{label}</h3>
                  </div>
                  <div>
                    {isAccountSelected[name] ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className={`transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium ${isEnableContinue && "active:scale-95"}`}
          onClick={() => {
            console.log("Navigates to another page...");
          }}
          disabled={!isEnableContinue}
        >
          Continue
        </button>
      </main>
    </div>
  );
}
