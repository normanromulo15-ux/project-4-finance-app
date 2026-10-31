export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#292933] w-full flex items-center justify-center py-3">
      <p className="text-sm text-white font-medium md:text-base">
        &copy; {currentYear}
      </p>
    </footer>
  );
}
