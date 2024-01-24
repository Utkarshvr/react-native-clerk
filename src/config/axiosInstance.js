import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.29.190:5000",
  // withCredentials: true,
});

export default axiosInstance;
