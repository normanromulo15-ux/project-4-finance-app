export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#292933] flex items-center justify-center py-3">
      <p className="text-sm text-white">&copy; {currentYear}</p>
    </footer>
  );
}
