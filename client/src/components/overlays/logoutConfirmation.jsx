export default function LogoutConfirmation(props) {
  const { theme, handleShowLogoutConfirmation, handleUserLogout } = props;

  return (
    <main
      className={`h-dvh flex flex-col items-center justify-center fixed inset-0 z-10 ${theme === "dark" ? "bg-gray-500/90" : "bg-black/70"}`}
    >
      <section
        className={`h-1/5 z-20 p-4 flex flex-col justify-center shadow-2xl gap-4 md:h-1/4 md:px-12 md:py-16 md:gap-0 md:justify-around lg:h-1/3 lg:justify-between ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}
      >
        <div className="text-lg font-semibold md:text-2xl">
          Are you sure you want to logout?
        </div>
        <div className="text-base font-medium flex justify-center items-center gap-6">
          <button
            className="transition-all duration-200 active:scale-95 hover:bg-gray-400 cursor-pointer text-gray-800 bg-gray-300 px-4 py-2 rounded-full md:text-xl"
            onClick={handleShowLogoutConfirmation}
          >
            Cancel
          </button>
          <button
            className="transition-all duration-200 active:scale-95 hover:bg-red-600 cursor-pointer text-white bg-red-500 px-4 py-2 rounded-full md:text-xl"
            onClick={handleUserLogout}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
