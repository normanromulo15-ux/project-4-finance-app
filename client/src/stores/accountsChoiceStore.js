import { create } from "zustand";

export const useAccountsChoiceStore = create((set, get) => {
  return {
    selectedAccounts: JSON.parse(
      sessionStorage.getItem("selectedAccounts") || "[]",
    ),

    addAccount: (name, label) => {
      const addedAccounts = [
        ...get().selectedAccounts,
        { name, label, amount: "" },
      ].sort((a, b) => a.name.localeCompare(b.name));

      sessionStorage.setItem("selectedAccounts", JSON.stringify(addedAccounts));

      set({ selectedAccounts: addedAccounts });
    },

    removeAccount: (name) => {
      const filteredAccounts = get()
        .selectedAccounts.filter((account) => account.name !== name)
        .sort((a, b) => a.name.localeCompare(b.name));

      sessionStorage.setItem(
        "selectedAccounts",
        JSON.stringify(filteredAccounts),
      );

      set({ selectedAccounts: filteredAccounts });
    },
  };
});
