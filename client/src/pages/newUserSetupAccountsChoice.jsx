import { useState } from "react";
import { useNavigate } from "react-router";
import { useAccountsChoiceStore } from "../stores/accountsChoiceStore.js";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function NewUserSetupAccountsChoice() {
  const navigate = useNavigate();
  const addAccount = useAccountsChoiceStore((state) => state.addAccount);
  const removeAccount = useAccountsChoiceStore((state) => state.removeAccount);
  const [accounts, setAccounts] = useState([
    { label: "Cash", icon: <MoneyIcon />, name: "cash", isSelected: false },
    {
      label: "E-Wallet",
      icon: <WalletIcon />,
      name: "eWallet",
      isSelected: false,
    },
    {
      label: "Savings",
      icon: <SavingsIcon />,
      name: "savings",
      isSelected: false,
    },
  ]);
  const isEnableContinue =
    accounts[0].isSelected || accounts[1].isSelected || accounts[2].isSelected;

  // Function to handle the selection of account choices
  function handleSelectAccountChoice(e, selectStatus, label) {
    const { name } = e.currentTarget;
    setAccounts((prev) =>
      prev.map((account) => {
        return account.name === name
          ? { ...account, isSelected: !account.isSelected }
          : account;
      }),
    );

    // Add or remove account choices based on the previous state of an account choice
    !selectStatus ? addAccount(name, label) : removeAccount(name, label);
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center gap-8 p-8 md:px-12">
      <header className="flex flex-col items-center text-center gap-2">
        <h1 className="font-medium text-2xl md:text-3xl">
          Select at least one account that you want to set up.
        </h1>
        <h2 className="font-medium text-gray-600 text-lg md:text-xl">
          You can add balance to the other accounts later.
        </h2>
      </header>
      <main className="w-full flex flex-col gap-4 md:w-1/2 md:gap-6">
        <ul className="flex flex-col gap-4">
          {accounts.map((account) => {
            const { label, icon, name, isSelected } = account;
            return (
              <li key={name}>
                <button
                  type="button"
                  className="transition-all duration-75 w-full border-2 px-2 py-4 rounded-md flex justify-between items-center"
                  name={name}
                  onClick={(e) => {
                    handleSelectAccountChoice(e, isSelected, label);
                  }}
                >
                  <div className="flex gap-1">
                    <div>{icon}</div>
                    <h4 className="font-medium md:text-lg">{label}</h4>
                  </div>
                  <div>
                    {isSelected ? (
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
          className={`transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium md:text-lg ${isEnableContinue && "active:scale-95"}`}
          onClick={() => {
            navigate("/new-user/accounts/setup");
          }}
          disabled={!isEnableContinue}
        >
          Continue
        </button>
      </main>
    </div>
  );
}
