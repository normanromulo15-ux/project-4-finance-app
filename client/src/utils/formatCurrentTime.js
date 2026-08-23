export function formatCurrentTime() {
  return new Date().toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "numeric",
  });
}
