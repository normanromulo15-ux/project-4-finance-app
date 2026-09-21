import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import BackButton from "../components/backButton.jsx";
import LogoutButton from "../components/logoutButton.jsx";

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
      <main className="h-dvh p-8 pt-14 flex flex-col gap-12">
        <h1 className="text-3xl">Hello, {firstName}</h1>
        <LogoutButton />
      </main>
      <BackButton endpoint={"/"} />
    </>
  );
}
