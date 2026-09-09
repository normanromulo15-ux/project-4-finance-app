import { redirect } from "react-router";
import { getTransactionHistory } from "../../services/app.js";

export default async function transactionsLoader() {
  try {
    const response = await getTransactionHistory();
    return response;
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
