import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import BackButton from "../components/backButton.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Profile() {
  const theme = localStorage.getItem("darkMode") || "light";
  const [displayTheme, setDisplayTheme] = useState(theme);
  const [showDisplayThemeOptions, setShowDisplayThemeOptions] = useState(false);
  const { fullName } = useLoaderData();
  const usersFullName = `${fullName.firstName} ${fullName.lastName}`;
  const displayThemeOptions = [
    {
      name: "Light",
      value: "light",
      icon: <LightModeIcon sx={{ scale: 0.85 }} />,
    },
    {
      name: "Dark",
      value: "dark",
      icon: <DarkModeIcon sx={{ scale: 0.85 }} />,
    },
  ];

  useEffect(() => {}, [displayTheme]);

  return (
    <>
      <div className="min-h-dvh p-8 pt-18 gap-8 md:px-25 md:py-28 lg:px-40 lg:flex lg:flex-col lg:items-center">
        <header>
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Profile
          </h1>
        </header>
        <main className="flex flex-col gap-4 mt-8 mb-4 md:text-lg lg:w-1/2">
          <section className="flex justify-between items-center">
            <h2>Full Name:</h2>
            <h2 className="font-medium">{usersFullName}</h2>
          </section>
          <section className="flex justify-between items-center">
            <h2>Display Setting:</h2>
            <button
              className="relative transition-all duration-75 cursor-pointer flex items-center gap-1 rounded-lg px-2 py-1 border-2"
              onClick={() => {
                setShowDisplayThemeOptions((prev) => !prev);
              }}
              onBlur={() => {
                setShowDisplayThemeOptions(false);
              }}
            >
              <h2 className="font-medium flex items-center">
                <span>
                  <LightModeIcon sx={{ scale: 0.85 }} />
                </span>{" "}
                <p>Light</p>
              </h2>
              <ArrowDropDownIcon />
              {showDisplayThemeOptions && (
                <ul className="absolute w-full left-0 -bottom-20">
                  {displayThemeOptions.map((theme) => {
                    return (
                      <li
                        key={theme.name}
                        className="transition-all duration-75 active:scale-95 hover:bg-gray-300 cursor-pointer flex items-center font-medium gap-2 border-2 rounded-lg px-2 py-1"
                      >
                        <div>{theme.icon}</div>
                        <p>{theme.name}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </button>
          </section>
        </main>
        <LogoutButton />
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
