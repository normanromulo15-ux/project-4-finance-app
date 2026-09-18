// Function to capitalize the first letter of a string
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to format a number to Philippine Peso
export function formatCurrency(value) {
  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return phpFormatter.format(value);
}

// Function to format the current time in Philippine format
export function formatCurrentTime() {
  return new Date().toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "numeric",
  });
}

// Function to format a timestamp
export function formatTimestamp(ISOTimestamp) {
  const formattedTimestamp = new Date(ISOTimestamp).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formattedTimestamp;
}

