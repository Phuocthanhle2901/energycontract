import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // refresh token dùng cookie HttpOnly
});

// ===========================
// REQUEST → gắn access token
// ===========================
axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ===========================
// RESPONSE → refresh token
// ===========================
axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const store = useAuthStore.getState();

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                // ⚠️ Swagger: refresh-token KHÔNG có body
                const res = await axios.post(
                    "http://localhost:5002/api/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                const newAccess = res.data.accessToken;

                store.setAuth(
                    { accessToken: newAccess, refreshToken: store.refreshToken! },
                    store.user
                );

                original.headers.Authorization = `Bearer ${newAccess}`;
                return axiosClient(original);

            } catch (err) {
                store.clearAuth();
                window.location.href = "/signin";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
