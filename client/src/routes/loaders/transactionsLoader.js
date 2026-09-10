import { redirect } from "react-router";
import { checkAuthentication } from "../../services/app.js";

export default async function transactionsLoader() {
  try {
    await checkAuthentication();
    return;
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
}
