import axios from "axios";

const axiosWrapper = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosWrapper.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // return error;
    return Promise.reject(error);
  }
);

export default axiosWrapper;
