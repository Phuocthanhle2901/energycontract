
export interface User {
    _id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}
export interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
    clearState: () => void;
}
export interface LoginResponse {
    accessToken: string;
    user: User;
}