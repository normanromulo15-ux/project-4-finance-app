import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});
const refreshTokenAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Configure the request interceptor
api.interceptors.request.use((config) => {
  const { accessToken } = api;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Configure the response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const { config } = error;

      if (error.response?.status === 401 && !config.firstAttempt) {
        config.firstAttempt = true;

        const { data } = await refreshTokenAPI.get("/auth/refresh");
        const { newAccessToken } = data;

        api.accessToken = newAccessToken;

        return api(config);
      }
    } catch (err) {
      console.error(err);
    }
    throw error;
  },
);

export default api;
