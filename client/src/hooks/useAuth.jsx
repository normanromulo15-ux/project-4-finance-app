import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <AuthContext value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  return { accessToken, setAccessToken };
}
