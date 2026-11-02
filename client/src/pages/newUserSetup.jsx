import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserFullNameStore } from "../stores/userFullNameStore.js";
import { getUserFullName } from "../services/app.js";

export default function NewUserSetup() {
  const navigate = useNavigate();
  const fullName = useUserFullNameStore((state) => state.fullName);
  const setFullName = useUserFullNameStore((state) => state.setFullName);
  const { firstName } = fullName;

  useEffect(() => {
    const getFullName = async () => {
      const response = await getUserFullName();
      setFullName(response);
    };
    getFullName();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-center font-semibold text-2xl md:text-3xl lg:text-4xl">
        Hi, {firstName}!
      </h1>
      <h2 className="text-center font=medium text-gray-600 text-xl md:text-2xl lg:text-3xl">
        Let's get things started for your finance.
      </h2>
      <button
        type="button"
        className="transition-all duration-200 cursor-pointer active:scale-95 hover:bg-[#2228A8] flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium md:text-lg md:px-5 md:py-3"
        onClick={() => navigate("/new-user/accounts-choice")}
      >
        Continue
      </button>
    </div>
  );
}
