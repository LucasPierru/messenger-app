import axios, { AxiosError, AxiosResponse } from "axios";

interface ApiError extends Error {
  response: AxiosResponse;
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL as string}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function createApiError(error: AxiosError): ApiError {
  if (error.response) {
    const apiError = new Error(error.message) as ApiError;
    (apiError as AxiosError).response = error.response;
    return apiError;
  }
  return error as ApiError;
}

export default api;
