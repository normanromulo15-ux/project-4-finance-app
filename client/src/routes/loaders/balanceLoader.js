import { redirect } from "react-router";
import { getCurrentBalance } from "../../services/app.js";

export default async function balanceLoader() {
  try {
    const userBalances = {
      cash: await getCurrentBalance("cash"),
      eWallet: await getCurrentBalance("eWallet"),
      savings: await getCurrentBalance("savings"),
    };

    return userBalances;
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
