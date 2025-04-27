import axios from "axios";
import config from "./config";
const axiosInstance = axios.create({
  baseURL: config.api,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token != null) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.getItem("token");
      location.reload();
    } else if (error.response.data.status === 401) {
      localStorage.getItem("token");
      location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
