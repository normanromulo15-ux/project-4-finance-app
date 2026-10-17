// List of transaction categories
export const transactionCategories = [
  "Communication",
  "Education",
  "Financial",
  "Food",
  "Government",
  "Health",
  "Housing",
  "Leisure",
  "Personal",
  "Social",
  "Technology",
  "Transportation",
  "Utilities",
  "Work",
];

// List of periods
export const periods = [
  {
    title: "1D",
    value: "day",
  },
  {
    title: "1W",
    value: "week",
  },
  { title: "1M", value: "month" },
  { title: "1Y", value: "year" },
];

// List of financial accounts
export const accounts = [
  {
    title: "Cash",
    value: "cash",
  },
  { title: "E-Wallet", value: "eWallet" },
  { title: "Savings", value: "savings" },
];

// List of months
export const months = [
  { value: "January" },
  { value: "February" },
  { value: "March" },
  { value: "April" },
  { value: "May" },
  { value: "June" },
  { value: "July" },
  { value: "August" },
  { value: "September" },
  { value: "October" },
  { value: "November" },
  { value: "December" },
];

// List of months with less than 31 days
export const monthsWithLessThan31Days = [
  "February",
  "April",
  "June",
  "September",
  "November",
];

// List of days
export const days = Array.from({ length: 31 }, (_, i) => {
  return { value: i + 1 };
});

// List of years
export const years = () => {
  const numberOfYears = 150;
  const endingYear = new Date().getFullYear();
  const startingYear = endingYear - numberOfYears;
  const listOfYears = Array.from(
    { length: endingYear - startingYear + 1 },
    (_, i) => {
      return { value: startingYear + i };
    },
  ).reverse();
  return listOfYears;
};
