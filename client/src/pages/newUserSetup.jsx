import { useState } from "react";
import { useLoaderData } from "react-router";

export default function NewUserSetup() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6">
      <h1 className="font-semibold text-2xl">Welcome, New User!</h1>
      <h2 className="font=medium text-gray-600 text-xl">
        Let's get things started.
      </h2>
      <button className="px-4 py-2 border font-medium rounded-full">
        Continue
      </button>
    </div>
  );
}
