// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // đổi cho đúng server của bạn
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
