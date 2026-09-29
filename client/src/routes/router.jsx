import { createBrowserRouter } from "react-router";

// Pages
import AccountDashboard from "../pages/accountDashboard.jsx";
import AccountOption from "../pages/transactionAccountOption.jsx";
import FundTransfer from "../pages/fundTransfer.jsx";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Profile from "../pages/profile.jsx";
import Register from "../pages/register.jsx";
import TransactionDetails from "../pages/transactionDetails.jsx";
import Transactions from "../pages/transactionsHistory.jsx";
import TransactionSuccess from "../pages/transactionSuccess.jsx";
import PageNotFound from "../pages/pageNotFound.jsx";

// Loaders
import userDataLoader from "./loaders/userDataLoader.js";
import authLoader from "./loaders/authLoader.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: userDataLoader,
  },
  {
    path: "/accounts/:account",
    element: <AccountDashboard />,
    loader: authLoader,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
    loader: userDataLoader,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    loader: authLoader,
  },
  {
    path: "/transfer",
    element: <FundTransfer />,
    loader: userDataLoader,
  },
  {
    path: "/transfer/success",
    element: <TransactionSuccess />,
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
  {
    path: "/:transactionType/:accountType/success",
    element: <TransactionSuccess />,
  },
  {
    path: "/not-found",
    element: <PageNotFound />,
  },
]);
