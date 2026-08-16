import { useEffect, useState } from "react";
import { getCurrentBalance } from "../services/app.js";
import LogoutButton from "../components/logoutButton.jsx";

export default function Home() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [balanceTimestamp, setBalanceTimestamp] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        const { accountBalance, balanceTimestamp } = await getCurrentBalance();
        setCurrentBalance(accountBalance);
        setBalanceTimestamp(balanceTimestamp);
      } catch (error) {
        console.error(error);
      }
    }

    getUserData();
  }, []);

  return (
    <main className="relative h-dvh flex flex-col items-center justify-center gap-4">
      <LogoutButton />
      <h1 className="text-xl">This is a Protected Route</h1>
      <h2 className="text-lg">Current Cash Balance: {currentBalance}</h2>
      <h3 className="text-base">As of: {balanceTimestamp}</h3>
    </main>
  );
}
