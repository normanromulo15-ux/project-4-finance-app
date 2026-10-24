import { create } from "zustand";

export const useAccountsChoiceStore = create((set) => {
  return {
    selectedAccounts: [],
    addAccount: (name, label) => {
      set((state) => {
        const { selectedAccounts } = state;
        return {
          selectedAccounts: [...selectedAccounts, { name, label }].sort(
            (a, b) => a.name.localeCompare(b.name),
          ),
        };
      });
    },
    removeAccount: (name) => {
      set((state) => {
        const { selectedAccounts } = state;
        return {
          selectedAccounts: selectedAccounts
            .filter((account) => account.name !== name)
            .sort((a, b) => a.name.localeCompare(b.name)),
        };
      });
    },
    reset: () => set({ selectedAccounts: [] }),
  };
});
