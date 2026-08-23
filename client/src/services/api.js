import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
});

const refreshTokenAPI = axios.create({
  baseURL: "http://localhost:3000",
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
    } catch (error) {
      console.error(error);
    }
    throw error;
  },
);

export default api;
