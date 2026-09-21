import { redirect } from "react-router";
import { getCurrentBalance } from "../../services/app.js";
import { getUserFullName } from "../../services/app.js";

export default async function userDataLoader() {
  try {
    // Retrieve the user's full name and current balance data for cash, eWallet, and savings accounts
    const [fullName, cash, eWallet, savings] = await Promise.all([
      getUserFullName(),
      getCurrentBalance("cash"),
      getCurrentBalance("eWallet"),
      getCurrentBalance("savings"),
    ]);

    console.log(fullName);

    return { fullName, cash, eWallet, savings };
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
