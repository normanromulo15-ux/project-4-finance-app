import { redirect } from "react-router";
import { getCurrentBalance } from "../../services/app.js";
import { getUserFullName } from "../../services/app.js";

export default async function userDataLoader() {
  try {
    const userFullName = await getUserFullName();
    const userBalances = {
      cash: await getCurrentBalance("cash"),
      eWallet: await getCurrentBalance("eWallet"),
      savings: await getCurrentBalance("savings"),
    };

    return { userFullName, userBalances };
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
