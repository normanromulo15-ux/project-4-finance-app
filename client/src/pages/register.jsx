import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  months,
  days,
  years,
  monthsWithLessThan31Days,
} from "../utils/constants.js";
import { checkLeapYear } from "../utils/helper.js";
import BackButton from "../components/backButton.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Register() {
  const dateData = [months, days, years()];
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    birthDate: {
      birthMonth: null,
      birthDay: null,
      birthYear: null,
    },
    email: "",
    password: "",
  });
  const { email, firstName, lastName, birthDate, password } = newUserData;
  const { birthMonth, birthDay, birthYear } = birthDate;
  const isEnableCredentialsSubmission = Boolean(
    firstName.trim() &&
    lastName.trim() &&
    email.includes("@") &&
    password.length >= 8 &&
    birthMonth &&
    birthDay &&
    birthYear,
  );

  const [dateOptions, setDateOptions] = useState([
    {
      name: "birthMonth",
      label: "Month",
      data: dateData[0],
      value: birthMonth,
    },
    { name: "birthDay", label: "Day", data: dateData[1], value: birthDay },
    { name: "birthYear", label: "Year", data: dateData[2], value: birthYear },
  ]);
  const [isShowDropdown, setIsShowDropdown] = useState({
    birthMonth: false,
    birthDay: false,
    birthYear: false,
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLeapYear, setIsLeapYear] = useState(true);
  const februaryDays = isLeapYear ? 29 : 28;
  const nameData = [
    {
      name: "firstName",
      value: firstName,
      placeholder: "First name",
    },
    { name: "lastName", value: lastName, placeholder: "Last name" },
  ];

  useEffect(() => {
    if (monthsWithLessThan31Days.includes(birthMonth)) {
      let filteredDays = [];
      switch (birthMonth) {
        case "February":
          filteredDays = dateData[1].filter((day) => day.value <= februaryDays);
          break;
        default:
          filteredDays = dateData[1].filter((day) => day.value <= 30);
          break;
      }
      setDateOptions((prev) =>
        prev.map((element) => {
          return element.name === "birthDay"
            ? { ...element, data: filteredDays }
            : element;
        }),
      );
    } else {
      setDateOptions([
        {
          name: "birthMonth",
          label: "Month",
          data: dateData[0],
          value: birthMonth,
        },
        { name: "birthDay", label: "Day", data: dateData[1], value: birthDay },
        {
          name: "birthYear",
          label: "Year",
          data: dateData[2],
          value: birthYear,
        },
      ]);
    }
  }, [birthMonth, birthYear]);

  // Function to handle the user's input data
  function handleUserInput(e) {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle the display of the dropdown menus for the birth date
  function handleDisplayBirthDateDropdowns(e) {
    const { name } = e.currentTarget;
    setIsShowDropdown((prev) => ({
      ...prev,
      [name]: !prev[name],
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

  // Function to handle the selection of the three birth date dropdowns
  function handleClickOption(e) {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      birthDate: { ...prev.birthDate, [name]: value },
    }));
    setDateOptions((prev) =>
      prev.map((element) => {
        return element.name === name ? { ...element, value } : element;
      }),
    );
    switch (name) {
      case "birthYear":
        setIsLeapYear(checkLeapYear(value));
        return;
    }
  }

  // Function to handle the submission of the new user's credentials
  function handleSubmitNewUserInfo(e) {
    e.preventDefault();
    if (!isEnableCredentialsSubmission) {
      console.log("Please fill up all input fields");
      return;
    }
    console.log("User successfully created");
    console.log(newUserData);
  }

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-10 px-8 pt-18 pb-8 md:px-25 md:py-16">
        <h1 className="text-2xl font-medium text-center md:flex-0 md:text-3xl lg:w-1/2">
          Get started with Finance
        </h1>
        <form
          className="w-full flex flex-col gap-8 lg:w-1/3"
          autoComplete="off"
          onSubmit={handleSubmitNewUserInfo}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium md:text-xl">Name</h2>
            <div className="flex flex-col gap-4 lg:flex-row">
              {nameData.map((item, index) => {
                return (
                  <input
                    key={index}
                    className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:outline-2 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg font-medium md:text-lg"
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
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium md:text-xl">Birthday</h2>
            <div className="flex justify-center items-center gap-3 md:gap-6 lg:justify-around lg:gap-0">
              {dateOptions.map((item) => {
                const { label, name, data, value } = item;
                return (
                  <div key={name} className="relative">
                    <button
                      type="button"
                      className="transition-all duration-75 cursor-pointer hover:outline-2 bg-gray-100 border border-gray-300 flex items-center p-3 rounded-lg h-15 md:h-16"
                      name={name}
                      onClick={handleDisplayBirthDateDropdowns}
                      onBlur={handleHideBirthDateDropdowns}
                    >
                      {value ? (
                        <div className="flex flex-col items-start">
                          <h3 className="text-gray-500 font-medium text-xs md:text-sm">
                            {label}
                          </h3>
                          <h4 className="font-medium md:text-lg self-center">
                            {value}
                          </h4>
                        </div>
                      ) : (
                        <h3 className="font-medium text-gray-500 md:text-lg">
                          {label}
                        </h3>
                      )}
                      <div>
                        <ArrowDropDownIcon />
                      </div>
                    </button>
                    {isShowDropdown[name] && (
                      <ol
                        className="absolute z-10 flex flex-col items-center overflow-y-auto
                      bg-gray-100 font-medium shadow-2xl w-auto h-40 -bottom-40 left-0 md:h-60 md:-bottom-60"
                      >
                        {data.map((item) => {
                          const { value } = item;
                          return (
                            <li key={value} className="w-full">
                              <button
                                className="w-full transition-all duration-75 hover:bg-gray-300 cursor-pointer px-4 py-2 md:text-lg"
                                type="button"
                                name={name}
                                value={value}
                                onMouseDown={handleClickOption}
                              >
                                {value}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium md:text-xl">Email</h2>
            <input
              className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:outline-2 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg font-medium md:text-lg"
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
            <h2 className="text-lg font-medium md:text-xl">Password</h2>
            <div className="relative">
              <input
                className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:outline-2 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg font-medium md:text-lg"
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
                  <VisibilityIcon sx={{ scale: 0.85 }} />
                ) : (
                  <VisibilityOffIcon sx={{ scale: 0.85 }} />
                )}
              </div>
            </div>
          </div>
          <button className="transition-all duration-75 disabled:bg-gray-400 hover:bg-[#2228A8] active:scale-95 cursor-pointer w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl disabled:cursor-not-allowed md:text-xl md:py-3 lg:mt-0">
            Create Account
          </button>
        </form>
      </div>
      <BackButton endpoint={"/login"} />
    </>
  );
}
