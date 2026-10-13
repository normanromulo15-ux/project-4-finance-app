import { useState } from "react";
import { useNavigate } from "react-router";
import BackButton from "../components/backButton.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const [newUserData, setNewUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    password: "",
  });
  const { email, firstName, lastName, birthDate, password } = newUserData;
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isEnableSubmit, setIsEnableSubmit] = useState(false);
  const nameData = [
    {
      name: "firstName",
      value: firstName,
      placeholder: "First name",
    },
    { name: "lastName", value: lastName, placeholder: "Last name" },
  ];
  const passwordData = [
    { name: "password", value: password, placeholder: "Enter password" },
    {
      name: "confirmationPassword",
      value: confirmationPassword,
      placeholder: "Confirm password",
    },
  ];

  // Function to handle the user's input data
  function handleUserInput(e) {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
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
            {nameData.map((item) => {
              return (
                <input
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
              {["Month", "Day", "Year"].map((item) => {
                return <div className="p-2 bg-gray-300 rounded-lg">{item}</div>;
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
            <input
              className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
              type="password"
              name="password"
              value={password}
              onChange={handleUserInput}
              placeholder="Enter password"
              required={true}
            />
            <input
              className="w-full transition-all duration-75 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
              type="password"
              name="confirmationPassword"
              value={password}
              onChange={handleUserInput}
              placeholder="Confirm password"
              required={true}
            />
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
