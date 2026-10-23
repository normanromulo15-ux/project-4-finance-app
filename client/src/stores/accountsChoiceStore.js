import { create } from "zustand";

export const useAccountsChoiceStore = create((set) => {
  return {
    selectedAccounts: [],
    addAccount: (name) => {
      set((state) => ({
        selectedAccounts: [...state.selectedAccounts, name].sort(),
      }));
    },
    removeAccount: (name) => {
      set((state) => ({
        selectedAccounts: state.selectedAccounts
          .filter((account) => account !== name)
          .sort(),
      }));
    },
    reset: () => set({ selectedAccounts: [] }),
  };
});
