export function formatTimestamp(ISOTimestamp) {
  const formattedTimestamp = new Date(ISOTimestamp).toLocaleString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formattedTimestamp;
}
