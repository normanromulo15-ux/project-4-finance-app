import api from "./api.js";

// Function to login a user
export async function loginUser(credentials) {
  try {
    const { data } = await api.post("/auth/login", credentials);

    return data;
  } catch (error) {
    throw error;
  }
}

// Function to log out a user
export async function logoutUser() {
  try {
    await api.delete("/auth/logout");
  } catch (error) {
    throw error;
  }
}
