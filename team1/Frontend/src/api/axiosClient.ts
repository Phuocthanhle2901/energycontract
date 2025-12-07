import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// REQUEST → attach accessToken
axiosClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE → auto refresh token
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const store = useAuthStore.getState();

        // Nếu token hết hạn → refresh
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const res = await axios.post(
                    "http://localhost:5002/api/auth/refresh-token",
                    { refreshToken: store.refreshToken },
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
