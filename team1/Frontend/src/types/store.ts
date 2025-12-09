import type { User } from "./user";

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
    clearState: () => void;
}
