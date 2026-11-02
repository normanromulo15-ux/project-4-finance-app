import { create } from "zustand";

export const useNewUserAccountsChoiceStore = create((set, get) => ({
  selectedAccounts: JSON.parse(
    sessionStorage.getItem("selectedAccounts") || "[]",
  ),

  addAccount: (name, label) => {
    const addedAccounts = [...get().selectedAccounts, { name, label }].sort(
      (a, b) => a.name.localeCompare(b.name),
    );

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
}));
