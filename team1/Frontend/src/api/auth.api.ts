// auth.api.ts
import axios from "axios";

export const api_auth = axios.create({
    baseURL: "http://localhost:5002/api/auth",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// LOGIN
export const loginApi = (data: { username: string; password: string }) =>
    api_auth.post("/login", data).then((r) => r.data);

// REGISTER
export const registerApi = (data: any) =>
    api_auth.post("/register", data).then((r) => r.data);

// ME
export const meApi = () => api_auth.get("/me").then((r) => r.data);

// REFRESH-TOKEN — swagger KHÔNG nhận body!!!
export const refreshApi = () => api_auth.post("/refresh-token").then((r) => r.data);

// LOGOUT — swagger yêu cầu body { refreshToken }, nhưng BE tự xử lý
export const logoutApi = () => api_auth.post("/logout", {}).then((r) => r.data);
