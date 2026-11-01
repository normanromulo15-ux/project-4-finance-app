import { create } from "zustand";

export const useTransactionDetailsStore = create((set) => ({
  transactionDetails: {
    account: sessionStorage.getItem("selectedTransactionAccount") ?? "",
    amount: sessionStorage.getItem("inputAmount") ?? "",
    category: sessionStorage.getItem("inputCategory") ?? "",
    description: sessionStorage.getItem("inputDescription") ?? "",
    type: sessionStorage.getItem("transactionType") ?? "",
  },

  setTransactionDetails: (name, value) => {
    set((state) => ({
      transactionDetails: {
        ...state.transactionDetails,
        [name]: value,
      },
    }));
  },

  clearCategoryAndDescription: () => {
    sessionStorage.removeItem("inputCategory");
    sessionStorage.removeItem("inputDescription");

    set((state) => ({
      transactionDetails: {
        ...state.transactionDetails,
        category: "",
        description: "",
      },
    }));
  },

  clearTransactionDetails: () => {
    sessionStorage.removeItem("selectedTransactionAccount");
    sessionStorage.removeItem("inputAmount");
    sessionStorage.removeItem("inputCategory");
    sessionStorage.removeItem("inputDescription");
    sessionStorage.removeItem("transactionType");

    set({
      transactionDetails: {
        account: "",
        amount: "",
        category: "",
        description: "",
        type: "",
      },
    });
  },
}));
