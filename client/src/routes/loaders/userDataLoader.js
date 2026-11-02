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

    return { userFullName, userAccountsData };
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
