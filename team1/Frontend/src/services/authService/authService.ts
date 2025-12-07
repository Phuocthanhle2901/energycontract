import api_auth from "@/api/auth.api";
import { useAuthStore } from "@/stores/useAuthStore";

export const authService = {
    register: (data: any) => api_auth.post("/register", data).then(r => r.data),

    login: async (data: { username: string; password: string }) => {
        const res = await api_auth.post("/login", data);
        return res.data; // must return { accessToken, refreshToken, user }
    },

    logout: async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        return api_auth.post("/logout", { refreshToken });
    },

    me: () => api_auth.get("/me").then(r => r.data),

    refresh: () => api_auth.post("/refresh-token"),
};
