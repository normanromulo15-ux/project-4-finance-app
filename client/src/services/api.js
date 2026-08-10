import { useAuth } from "../hooks/useAuth.js";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
});

// Configure the request interceptor
api.interceptors.request.use((config) => {
  const { accessToken } = useAuth();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${token}`;
    return null;
  }

  return config;
});

// Configure the response interceptor
api.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (!error.userAuthenticated && error.response?.status === 401) {
      error.userAuthenticated = true;
    }

    return Promise.reject(error);
  },
);

export default api;
