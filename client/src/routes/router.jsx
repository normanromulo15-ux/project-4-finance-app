import { createBrowserRouter } from "react-router";

// Pages
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import AccountOption from "../pages/accountOption.jsx";
import TransactionDetails from "../pages/transactionDetails.jsx";

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
    path: "/:transactionType",
    element: <AccountOption />,
    loader: balanceLoader,
  },
  {
    path: "/:transactionType/:accountType",
    element: <TransactionDetails />,
    loader: balanceLoader,
  },
]);
