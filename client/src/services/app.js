import api from "./api.js";

// Function to check if a user is authenticated
export async function checkAuthentication() {
  try {
    await api.get("/authentication");
    return;
  } catch (error) {
    throw error;
  }
}

// Function to get a user's current balance of a certain account
export async function getCurrentBalance(account) {
  try {
    const { data } = await api.get(`/balance/${account}`);
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to add the daily interest to the savings account
export async function addDailyInterest() {
  try {
    await api.post("/interest");
    return;
  } catch (error) {
    console.error(error);
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

// Function to transfer a fund from one account to another
export async function transferFunds(transferDetails) {
  try {
    const { data } = await api.post("/transfer", transferDetails);
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to retrieve the transaction history of a user
export async function getTransactionHistory(page = "1") {
  try {
    return await api.get("/transactions", { params: { page } });
  } catch (error) {
    throw error;
  }
}
