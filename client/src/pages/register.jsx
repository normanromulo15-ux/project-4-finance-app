import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { months, days, years } from "../utils/constants.js";
import BackButton from "../components/backButton.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Register() {
  const [newUserData, setNewUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    birthDate: {
      birthMonth: null,
      birthDay: null,
      birthYear: null,
    },
    password: "",
  });
  const { email, firstName, lastName, birthDate, password } = newUserData;
  const { birthMonth, birthDay, birthYear } = birthDate;
  const [dateOptions, setDateOptions] = useState([
    { name: "birthMonth", label: "Month", data: months },
    { name: "birthDay", label: "Day", data: days },
    { name: "birthYear", label: "Year", data: years() },
  ]);
  const [isShowDropdown, setIsShowDropdown] = useState({
    birthMonth: false,
    birthDay: false,
    birthYear: false,
  });
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmationPassword, setIsShowConfirmationPassword] =
    useState(false);
  const [isEnableSubmit, setIsEnableSubmit] = useState(false);
  const nameData = [
    {
      name: "firstName",
      value: firstName,
      placeholder: "First name",
    },
    { name: "lastName", value: lastName, placeholder: "Last name" },
  ];

  // Function to handle the user's input data
  function handleUserInput(e) {
    const { name, value } = e.target;
    if (name === "confirmationPassword") {
      setConfirmationPassword(value);
      return;
    }
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle the display of the dropdown menus for the birth date
  function handleDisplayBirthDateDropdowns(e) {
    const { name: dropdownOption } = e.currentTarget;
    setIsShowDropdown((prev) => ({
      ...prev,
      [dropdownOption]: !prev[dropdownOption],
    }));
  }

  // Function to handle the hiding of the dropdown menus for the birth date
  function handleHideBirthDateDropdowns() {
    setIsShowDropdown({
      birthMonth: false,
      birthDay: false,
      birthYear: false,
    });
  }

  return (
    <>
      <main className="min-h-dvh flex flex-col  items-center px-10 py-18">
        <h1 className="flex-1 text-2xl font-medium">
          Get started with Finance
        </h1>
        <form className="w-full flex flex-col gap-8" autoComplete="off">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Name</h2>
            {nameData.map((item, index) => {
              return (
                <input
                  key={index}
                  className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
                  type="text"
                  name={item.name}
                  value={item.value}
                  onChange={handleUserInput}
                  placeholder={item.placeholder}
                  autoFocus={item.name === "firstName"}
                  autoComplete="off"
                  required={true}
                />
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Birthday</h2>
            <div className="flex justify-evenly items-center">
              {dateOptions.map((item) => {
                const { label, name, data } = item;
                return (
                  <button
                    key={name}
                    type="button"
                    className="relative p-2 bg-gray-100 border border-gray-300 rounded-lg flex gap-1 items-center"
                    name={name}
                    onClick={handleDisplayBirthDateDropdowns}
                    onBlur={handleHideBirthDateDropdowns}
                  >
                    <h3 className="font-medium text-gray-500">{label}</h3>
                    <div>
                      <ArrowDropDownIcon />
                    </div>
                    {isShowDropdown[name] && (
                      <div
                        className="absolute z-10 flex flex-col overflow-y-auto
                      bg-gray-100 font-medium shadow-2xl p-4 w-full h-40 -bottom-40 left-0"
                      >
                        {data.map((item) => {
                          return <p key={item.value}>{item.value}</p>;
                        })}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Email</h2>
            <input
              className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
              type="email"
              name="email"
              value={email}
              onChange={handleUserInput}
              placeholder="Enter email address"
              autoComplete="off"
              required={true}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Password</h2>
            <div className="relative">
              <input
                className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
                type={isShowPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleUserInput}
                placeholder="Enter password"
                required={true}
              />
              <div
                className="transition-all duration-75 active:scale-95 cursor-pointer absolute right-3 top-1.5"
                onClick={() => {
                  setIsShowPassword((prev) => !prev);
                }}
              >
                {isShowPassword ? (
                  <VisibilityOffIcon sx={{ scale: 0.85 }} />
                ) : (
                  <VisibilityIcon sx={{ scale: 0.85 }} />
                )}
              </div>
            </div>
            <div className="relative">
              <input
                className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
                type={isShowConfirmationPassword ? "text" : "password"}
                name="confirmationPassword"
                value={confirmationPassword}
                onChange={handleUserInput}
                placeholder="Confirm password"
                required={true}
              />
              <div
                className="transition-all duration-75 active:scale-95 cursor-pointer absolute right-3 top-1.5"
                onClick={() => {
                  setIsShowConfirmationPassword((prev) => !prev);
                }}
              >
                {isShowConfirmationPassword ? (
                  <VisibilityOffIcon sx={{ scale: 0.85 }} />
                ) : (
                  <VisibilityIcon sx={{ scale: 0.85 }} />
                )}
              </div>
            </div>
          </div>
          <button className="transition-all duration-75 disabled:bg-gray-400 hover:bg-[#2228A8] cursor-pointer w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl disabled:cursor-not-allowed md:text-xl md:py-3 lg:mt-0 lg:w-1/4">
            Create Account
          </button>
        </form>
      </main>
      <BackButton endpoint={"/login"} />
    </>
  );
}
