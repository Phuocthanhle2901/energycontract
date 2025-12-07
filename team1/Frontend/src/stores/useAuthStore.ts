import { create } from "zustand";

interface AuthState {
    user(arg0: { accessToken: any; refreshToken: string; }, user: any): unknown;
    setAuth(arg0: { accessToken: any; refreshToken: string; }, user: any): unknown;
    clearAuth(): unknown;
    accessToken: string | null;
    refreshToken: string | null;

    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,

    setTokens: ({ accessToken, refreshToken }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ accessToken, refreshToken });
    },

    clearTokens: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ accessToken: null, refreshToken: null });
    },
}));
