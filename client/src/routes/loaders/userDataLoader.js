import { redirect } from "react-router";
import { addDailyInterest } from "../../services/app.js";
import { getUserAccounts } from "../../services/app.js";
import { getCurrentBalance } from "../../services/app.js";
import { getUserFullName } from "../../services/app.js";

export default async function userDataLoader() {
  try {
    const { accounts } = await getUserAccounts();
    const userFullName = await getUserFullName();

    // Add daily interest to the savings account if it exists
    if (accounts.includes("savings")) {
      await addDailyInterest();
    }

    const userAccounts = accounts.map((account) => getCurrentBalance(account));
    const userAccountsData = await Promise.all(userAccounts);

    return { userFullName, userAccountsData };
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
