import { create } from "zustand";

export const useUserFullNameStore = create((set) => ({
  fullName: JSON.parse(
    sessionStorage.getItem("fullName") || '{ "firstName": "", "lastName": "" }',
  ),

  setFullName: (fullName) => {
    sessionStorage.setItem("fullName", JSON.stringify(fullName));
    set({ fullName });
  },
}));
