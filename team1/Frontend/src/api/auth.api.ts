import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

export const api_auth = axios.create({
    baseURL: "http://localhost:5002/api/auth",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// REQUEST
api_auth.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// RESPONSE + REFRESH
api_auth.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        const store = useAuthStore.getState();

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const res = await api_auth.post("/refresh-token", {
                    refreshToken: store.refreshToken,
                });

                const newAccessToken = res.data.accessToken;

                store.setAuth(
                    { accessToken: newAccessToken, refreshToken: store.refreshToken! },
                    store.user
                );

                original.headers.Authorization = `Bearer ${newAccessToken}`;
                return api_auth(original);
            } catch (refreshError) {
                store.clearAuth();
                window.location.href = "/signin";
            }
        }

        return Promise.reject(err);
    }
);

export default api_auth;
