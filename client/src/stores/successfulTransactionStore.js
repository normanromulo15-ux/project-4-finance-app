import { create } from "zustand";

export const useSuccessfulTransactionStore = create((set) => ({
  successfulTransactionDetails: {
    transactionAmount:
      sessionStorage.getItem("successfulTransactionAmount") ?? "",
    referenceNumber: sessionStorage.getItem("successfulReferenceNumber") ?? "",
    timestamp: sessionStorage.getItem("successfulTimestamp") ?? "",
  },

  setSuccessfulTransactionDetails: (details) => {
    const { transactionAmount, referenceNumber, timestamp } = details;
    sessionStorage.setItem(
      "successfulTransactionAmount",
      String(transactionAmount),
    );
    sessionStorage.setItem(
      "successfulReferenceNumber",
      String(referenceNumber),
    );
    sessionStorage.setItem("successfulTimestamp", String(timestamp));
    set({ successfulTransactionDetails: details });
  },
}));
