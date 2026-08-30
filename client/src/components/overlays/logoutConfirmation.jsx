export default function LogoutConfirmation(props) {
  const { handleShowLogoutConfirmation, handleUserLogout } = props;

  return (
    <main className="h-dvh bg-black/70 flex flex-col items-center justify-center fixed inset-0 z-10">
      <section className="h-1/5 z-20 bg-white p-4 flex flex-col justify-center gap-4">
        <div className="text-lg font-semibold">
          Are you sure you want to logout?
        </div>
        <div className="text-base font-medium flex justify-center items-center gap-6">
          <button
            className="text-gray-800 bg-gray-300 p-2 rounded-md"
            onClick={handleShowLogoutConfirmation}
          >
            Cancel
          </button>
          <button
            className="text-white bg-red-500 p-2 rounded-md"
            onClick={handleUserLogout}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
