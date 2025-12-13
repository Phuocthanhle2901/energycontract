// useAuthStore.ts
import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    user: any | null;

    setAuth: (token: string, user: any) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem("accessToken"),
    user: null,

    setAuth: (token, user) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token, user });
    },

    clearAuth: () => {
        localStorage.removeItem("accessToken");
        set({ accessToken: null, user: null });
    },
}));
