import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserFullName } from "../services/app.js";

export default function NewUserSetup() {
  const navigate = useNavigate();
  const [userFirstName, setUserFirstName] = useState("");

  useEffect(() => {
    const displayFirstName = async () => {
      const name = await getUserFullName();
      setUserFirstName(name.firstName);
    };
    displayFirstName();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-center font-semibold text-2xl">
        Hi, {userFirstName}!
      </h1>
      <h2 className="text-center font=medium text-gray-600 text-xl">
        Let's get things started for your finance.
      </h2>
      <button
        type="button"
        className="transition-all duration-200 cursor-pointer active:scale-95 hover:bg-[#2228A8] flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium"
        onClick={() => {
          console.log("Navigates to another page...");
        }}
      >
        Continue
      </button>
    </div>
  );
}
