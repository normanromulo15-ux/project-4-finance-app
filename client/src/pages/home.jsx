import { useLoaderData } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
import Header from "../layout/header.jsx";
import Navigation from "../layout/navigation.jsx";
import Accounts from "../layout/accounts.jsx";

export default function Home() {
  const theme = localStorage.getItem("theme") || "light";
  const { cash, eWallet, savings, userAccountsData } = useLoaderData();
  const spendingAccounts = userAccountsData.filter(
    (account) => account.accountType !== "savings",
  );

  return (
    <div
      className={`min-h-dvh flex flex-col items-center gap-12 p-8 pt-14 md:p-20 md:px-25 md:gap-16 lg:px-40 lg:py-12 ${theme === "dark" ? "bg-gray-950" : "bg-[#F2F4F7]"}`}
    >
      <Navigation />
      <div
        className={`w-full flex flex-col gap-12 lg:flex-row lg:gap-20 ${theme === "dark" && "text-white"}`}
      >
        <Header
          cash={cash}
          eWallet={eWallet}
          spendingAccounts={spendingAccounts}
          formatCurrency={formatCurrency}
        />
        <Accounts
          cash={cash}
          eWallet={eWallet}
          savings={savings}
          userAccountsData={userAccountsData}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
