// Function to check whether a given year is a leap year
export function checkLeapYear(year) {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeapYear;
}
