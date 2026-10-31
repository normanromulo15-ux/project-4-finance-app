import { redirect } from "react-router";
import { getUserAccounts } from "../../services/app.js";
import { getCurrentBalance } from "../../services/app.js";
import { getUserFullName } from "../../services/app.js";

export default async function userDataLoader() {
  try {
    const userFullName = await getUserFullName();
    const userAccounts = (await getUserAccounts()).map((account) =>
      getCurrentBalance(account),
    );
    const userAccountsData = await Promise.all(userAccounts);
    console.log(userFullName, userAccountsData);

    // Retrieve the user's full name and current balance data for cash, eWallet, and savings accounts
    const [fullName, cash, eWallet, savings] = await Promise.all([
      getUserFullName(),
      getCurrentBalance("cash"),
      getCurrentBalance("eWallet"),
      getCurrentBalance("savings"),
    ]);

    return { fullName, cash, eWallet, savings };
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
