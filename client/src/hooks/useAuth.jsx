import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext
      value={{ accessToken, isLoggedIn, setAccessToken, setIsLoggedIn }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const { accessToken, isLoggedIn, setIsLoggedIn, setAccessToken } =
    useContext(AuthContext);

  return { accessToken, isLoggedIn, setIsLoggedIn, setAccessToken };
}
