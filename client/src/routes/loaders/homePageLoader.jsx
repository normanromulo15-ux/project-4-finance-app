import { redirect } from "react-router";
import api from "../../services/api.js";

export default async function homePageLoader() {
  const { accessToken } = api;

  if (!accessToken) {
    try {
      const response = await api.get("/auth/refresh");
      const { newAccessToken } = response;
      api.accessToken = newAccessToken;

      return null;
    } catch (error) {
      console.error(error);
      return redirect("/login");
    }
  }

  return null;
}
