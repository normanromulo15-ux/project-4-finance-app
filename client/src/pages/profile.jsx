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
      <div className="h-dvh p-8 pt-14 flex flex-col gap-8 md:px-25 md:py-28">
        <header>
          <h1 className="text-center text-3xl font-bold">Profile</h1>
        </header>
        <main className="flex flex-col gap-4">
          <section className="flex items-center justify-between md:text-lg">
            <h2>Full Name:</h2>
            <h2 className="font-semibold px-2 py-1 border bg-gray-50 rounded-lg">
              {firstName} {lastName}
            </h2>
          </section>
          <LogoutButton />
        </main>
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
