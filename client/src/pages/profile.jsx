import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import BackButton from "../components/backButton.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Profile() {
  const displayThemeOptions = [
    {
      label: "Light",
      icon: <LightModeIcon sx={{ scale: 0.85 }} />,
      theme: "light",
    },
    {
      label: "Dark",
      icon: <DarkModeIcon sx={{ scale: 0.85 }} />,
      theme: "dark",
    },
  ];
  const theme = localStorage.getItem("theme") || "light";
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [displayTheme, setDisplayTheme] = useState({
    label: null,
    icon: null,
  });
  const [showDisplayThemeOptions, setShowDisplayThemeOptions] = useState(false);
  const { fullName } = useLoaderData();
  const usersFullName = `${fullName.firstName} ${fullName.lastName}`;

  useEffect(() => {
    const theme = displayThemeOptions.find(
      (option) => option.theme === selectedTheme,
    );
    const { label, icon } = theme;
    setDisplayTheme({ label, icon });
  }, [selectedTheme]);

  // Function to handle display setting preference
  function handleDisplaySettingPreference(option) {
    const { theme } = option;
    localStorage.setItem("theme", theme);
    setSelectedTheme(theme);
  }

  return (
    <>
      <div
        className={`min-h-dvh p-8 pt-18 gap-8 md:px-25 md:py-28 lg:px-40 lg:flex lg:flex-col lg:items-center ${selectedTheme === "dark" && "text-white bg-gray-950"}`}
      >
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
            <div
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setShowDisplayThemeOptions(false);
                }
              }}
            >
              <button
                className="transition-all duration-75 cursor-pointer flex items-center gap-1 rounded-lg px-2 py-1 border-2"
                onClick={() => {
                  setShowDisplayThemeOptions((prev) => !prev);
                }}
              >
                <h2 className="font-medium flex items-center">
                  <span>{displayTheme.icon}</span> <p>{displayTheme.label}</p>
                </h2>
                <ArrowDropDownIcon />
              </button>
              {showDisplayThemeOptions && (
                <ul
                  className={`absolute z-10 w-45 right-0 -bottom-28 p-3 border flex flex-col gap-2 ${selectedTheme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
                >
                  {displayThemeOptions.map((displayTheme) => {
                    return (
                      <li key={displayTheme.label}>
                        <button
                          type="button"
                          className={`w-full transition-all duration-75 active:scale-95  cursor-pointer flex items-center font-medium gap-2 border rounded-lg px-2 py-1 ${selectedTheme === "dark" ? "bg-gray-800 hover:bg-gray-900" : "bg-white hover:bg-gray-300"}`}
                          onClick={() => {
                            handleDisplaySettingPreference(displayTheme);
                            setShowDisplayThemeOptions(false);
                          }}
                        >
                          <div>{displayTheme.icon}</div>
                          <p>{displayTheme.label}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </main>
        <LogoutButton />
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
