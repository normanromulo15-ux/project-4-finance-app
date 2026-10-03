import { useNavigate } from "react-router";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-10 px-8">
      <div className="flex flex-col items-center justify-center gap-2 ">
        <h1 className="font-bold text-4xl">404</h1>
        <h2 className="font-medium text-2xl">Page Not Found</h2>
        <h3 className="text-center text-lg">
          The page you're looking for doesn't exist or was moved elsewhere.
        </h3>
      </div>
      <button
        className="font-medium text-white bg-[#2830c9] rounded-full px-4 py-2 text-lg"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
