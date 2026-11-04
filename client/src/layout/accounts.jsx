import { useState } from "react";
import { useNavigate } from "react-router";
import BalanceVisibility from "../components/balanceVisibility.jsx";
import MoneyIcon from "@mui/icons-material/Money";
import WalletIcon from "@mui/icons-material/Wallet";
import SavingsIcon from "@mui/icons-material/Savings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Accounts(props) {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const accountsBalanceVisibility =
    localStorage.getItem("accountsBalanceVisibility") ?? "Yes";
  const [balanceVisibility, setBalanceVisibility] = useState(
    Boolean(accountsBalanceVisibility),
  );
  const { userAccountsData, formatCurrency } = props;

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
      <div className="flex justify-between items-center px-2 pb-2 mb-4 border-b-2 text-2xl md:text-3xl md:mb-8">
        <h3 className="font-semibold">Accounts</h3>
        <BalanceVisibility
          balance={"allAccounts"}
          balanceVisibility={balanceVisibility}
          handleBalanceVisibility={handleBalanceVisibility}
        />
      </div>
      <div className="flex flex-col gap-4 md:gap-4">
        {userAccountsData.map((account) => {
          const { accountType, latestAccountBalance } = account;
          let accountName;
          let AccountIcon;

          switch (accountType) {
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
              className={`transition-all duration-75 cursor-pointer active:scale-95 flex justify-between items-center border border-t-4 border-[#2830c9] px-4 py-2 rounded-2xl md:p-5 lg:border-2 lg:border-t-6 lg:rounded-3xl ${theme === "dark" ? "bg-gray-900 hover:bg-[#072446]" : "bg-white hover:bg-blue-100"}`}
              key={accountType}
              onClick={() => navigate(`/accounts/${accountType}?period=week`)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center text-xl font-semibold gap-2 md:text-2xl">
                  {AccountIcon}
                  <h3>{accountName}</h3>
                </div>
                <h4 className="overflow-hidden font-bold text-lg md:text-xl">
                  {balanceVisibility
                    ? formatCurrency(latestAccountBalance)
                    : "₱·····"}
                </h4>
              </div>
              <div>
                <ArrowForwardIosIcon />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
