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
  const accountsStatus = JSON.parse(
    sessionStorage.getItem("accountsStatus") || "[false, false, false]",
  );
  const [isNotSelectCash, isNotSelectEWallet, isNotSelectSavings] =
    accountsStatus;
  const addAccount = useAccountsChoiceStore((state) => state.addAccount);
  const removeAccount = useAccountsChoiceStore((state) => state.removeAccount);
  const [accounts, setAccounts] = useState([
    {
      label: "Cash",
      icon: <MoneyIcon />,
      name: "cash",
      isSelected: isNotSelectCash,
    },
    {
      label: "E-Wallet",
      icon: <WalletIcon />,
      name: "eWallet",
      isSelected: isNotSelectEWallet,
    },
    {
      label: "Savings",
      icon: <SavingsIcon />,
      name: "savings",
      isSelected: isNotSelectSavings,
    },
  ]);
  const isEnableContinue = accounts
    .map((account) => account.isSelected)
    .includes(true);

  // Function to handle the click of account choices
  function handleClickAccountChoice(e, isCheck, label, index) {
    const { name } = e.currentTarget;
    const selectedAccounts = accountsStatus.map((isCheck, elementIndex) => {
      return elementIndex === index ? !isCheck : isCheck;
    });
    sessionStorage.setItem("accountsStatus", JSON.stringify(selectedAccounts));

    setAccounts((prev) =>
      prev.map((account) => {
        return account.name === name
          ? { ...account, isSelected: !account.isSelected }
          : account;
      }),
    );

    // Add or remove account choices based on the previous state of an account choice
    !isCheck ? addAccount(name, label) : removeAccount(name, label);
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center gap-8 p-8 md:px-12">
      <header className="flex flex-col items-center gap-2 text-center md:w-2/3 lg:w-1/3">
        <h1 className="font-medium text-2xl md:text-3xl">
          Select accounts or an account that you want to set up.
        </h1>
        <h2 className="font-medium text-gray-600 text-lg md:text-xl">
          You can add balance to the other accounts later.
        </h2>
      </header>
      <main className="w-full flex flex-col gap-8 md:gap-6 md:w-2/3 lg:w-1/4">
        <ul className="flex flex-col gap-4">
          {accounts.map((account, index) => {
            const { label, icon, name, isSelected } = account;
            return (
              <li key={name}>
                <button
                  type="button"
                  className="transition-all duration-75 cursor-pointer w-full border-2 px-2 py-4 rounded-md flex justify-between items-center"
                  name={name}
                  onClick={(e) => {
                    handleClickAccountChoice(e, isSelected, label, index);
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
          className={`transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 disabled:cursor-not-allowed
            flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium md:text-lg ${isEnableContinue && "active:scale-95"}`}
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
