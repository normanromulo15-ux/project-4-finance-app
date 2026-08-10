import { redirect } from "react-router";

export default async function authLoader() {
  return redirect("/login");
}
