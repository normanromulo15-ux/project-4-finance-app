import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function NewUserTopUpSuccess() {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center gap-8 p-8 md:px-12 lg:gap-16">
      <header className="flex flex-col gap-6 text-center md:gap-8">
        <h1 className="text-[#2830c9] font-bold text-3xl md:text-4xl">
          Top Up Success!
        </h1>
        <div>
          <CheckCircleIcon sx={{ scale: 2, color: "#2830c9" }} />
        </div>
      </header>
      <main className="flex flex-col gap-2 lg:gap-4">
        <h2 className="text-center font-medium text-lg md:text-xl">
          You can now view your account page.
        </h2>
        <button
          type="button"
          className="transition-all cursor-pointer active:scale-95 bg-[#2830c9] hover:bg-[#2228A8] text-white font-medium px-4 py-2 rounded-full md:text-lg"
        >
          Go To Dashboard
        </button>
      </main>
    </div>
  );
}
