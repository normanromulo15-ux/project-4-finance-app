import { createBrowserRouter } from "react-router";

// Pages
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import AccountOption from "../pages/accountOption.jsx";
import TransactionDetails from "../pages/transactionDetails.jsx";

// Loaders
import userDataLoader from "./loaders/userDataLoader.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: userDataLoader,
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
    loader: userDataLoader,
  },
  {
    path: "/:transactionType/:accountType",
    element: <TransactionDetails />,
    loader: userDataLoader,
  },
]);
