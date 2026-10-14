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
  { month: "January", order: 1 },
  { month: "February", order: 2 },
  { month: "March", order: 3 },
  { month: "April", order: 4 },
  { month: "May", order: 5 },
  { month: "June", order: 6 },
  { month: "July", order: 7 },
  { month: "August", order: 8 },
  { month: "September", order: 9 },
  { month: "October", order: 10 },
  { month: "November", order: 11 },
  { month: "December", order: 12 },
];

// List of days
export const days = new Array(31).fill(1).map((day, index) => day + index);

// List of years
export const years = () => {
  const numberOfYears = 150;
  const endingYear = new Date().getFullYear();
  const startingYear = endingYear - numberOfYears;
  const listOfYears = new Array(endingYear - startingYear + 1)
    .fill(startingYear)
    .map((year, index) => year + index);
  return listOfYears;
};
