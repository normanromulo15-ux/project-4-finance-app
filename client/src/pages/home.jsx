import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
import { addDailyInterest } from "../services/app.js";
import Header from "../layout/header.jsx";
import Navigation from "../layout/navigation.jsx";
import Accounts from "../layout/accounts.jsx";

export default function Home() {
  const { cash, eWallet, savings } = useLoaderData();

  useEffect(() => {
    async function addInterestToSavings() {
      return await addDailyInterest();
    }
    addInterestToSavings();
  }, []);

  return (
    <div className="relative h-dvh flex flex-col items-center gap-12 p-8 pt-10">
      <Header cash={cash} eWallet={eWallet} formatCurrency={formatCurrency} />
      <Navigation />
      <Accounts
        cash={cash}
        eWallet={eWallet}
        savings={savings}
        formatCurrency={formatCurrency}
      />

    </div>
  );
}
