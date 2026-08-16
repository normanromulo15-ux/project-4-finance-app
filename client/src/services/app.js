import api from "./api.js";

// Function to get a user's current balance of a certain account
export async function getCurrentBalance(account = "savings") {
  try {
    const { data } = await api.get(`/${account}`);

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to log out a user
export async function logoutUser() {
  try {
    await api.delete("/auth/logout");
  } catch (error) {
    console.error(error);
  }
}
