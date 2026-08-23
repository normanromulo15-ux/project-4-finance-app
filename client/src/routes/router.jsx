import { createBrowserRouter } from "react-router";

// Pages
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import AccountOption from "../pages/accountOption.jsx";
import DebitTransaction from "../pages/debitTransaction.jsx";

// Loaders
import balanceLoader from "./loaders/balanceLoader.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: balanceLoader,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/transaction",
    element: <AccountOption />,
    loader: balanceLoader,
  },
  {
    path: "/transaction/debit",
    element: <DebitTransaction />,
    loader: balanceLoader,
  },
]);
