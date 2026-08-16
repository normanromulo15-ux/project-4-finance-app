import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
});

// Configure the request interceptor
api.interceptors.request.use((config) => {
  const { accessToken } = api;
  config.accessToken = accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken} `;
  }

  return config;
});

// Configure the response interceptor
api.interceptors.response.use(
  (config) => config,
  async (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

export default api;
