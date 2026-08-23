export function formatCurrency(value) {
  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return phpFormatter.format(value);
}
