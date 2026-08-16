import { createBrowserRouter } from "react-router";

// Pages
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";

// Loaders
import homePageLoader from "./loaders/homePageLoader.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
    loader: homePageLoader,
  },
]);
