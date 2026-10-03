import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import BackButton from "../components/backButton.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

export default function Profile() {
  const [userFullName, setUserFullName] = useState({
    firstName: "",
    lastName: "",
  });
  const { firstName, lastName } = userFullName;
  const { fullName } = useLoaderData();

  useEffect(() => {
    setUserFullName({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    });
  }, []);

  return (
    <>
      <div className="min-h-dvh p-8 pt-14 flex flex-col gap-8 md:px-25 md:py-28">
        <header>
          <h1 className="text-center text-3xl font-bold">Profile</h1>
        </header>
        <main className="flex flex-col gap-4 md:text-lg">
          <section className="flex items-center justify-between">
            <h2>Full Name:</h2>
            <h2 className="font-medium">
              {firstName} {lastName}
            </h2>
          </section>
          <section className="flex justify-between items-center">
            <h2>Display Setting:</h2>
            <div className="flex flex-col gap-1">
              <ToggleOffIcon sx={{ scale: 1.1 }} />
            </div>
          </section>
        </main>
        <LogoutButton />
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
