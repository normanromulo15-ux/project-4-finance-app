import api from "./api.js";

// Function to get a user's current balance of a certain account
export async function getCurrentBalance(account) {
  try {
    const { data } = await api.get(`/balances/${account}`);

    return data;
  } catch (error) {
    throw error;
  }
}

// Function to add the daily interest to the savings account
export async function addDailyInterest(account = "savings") {
  try {
    const { data } = await api.post(`/interest/${account}`);

    return data;
  } catch (error) {
    throw error;
  }
}

// Function to retrieve the full name of an authorized user
export async function getUserFullName() {
  try {
    const { data } = await api.get("/name");

    return data;
  } catch (error) {
    throw error;
  }
}

// Function to add a transaction to the database
export async function addTransaction(transactionDetails) {
  try {
    const { data } = await api.post("/transaction", transactionDetails);

    return data;
  } catch (error) {
    throw error;
  }
}
