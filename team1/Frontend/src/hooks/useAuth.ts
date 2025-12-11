// useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService/authService";
import { useAuthStore } from "@/stores/useAuthStore";

// LOGIN
export const useLogin = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: authService.login,

        onSuccess: (res) => {
            setAuth(res.accessToken, res.user);
            toast.success("Login successful!");
            navigate("/home");
        },

        onError: () => toast.error("Invalid username or password"),
    });
};

// REGISTER
export const useRegister = () =>
    useMutation({
        mutationFn: authService.register,
        onSuccess: () => toast.success("Register successful!"),
        onError: () => toast.error("Register failed"),
    });

// ME
export const useUser = () => {
    const token = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: ["me"],
        queryFn: authService.me,
        enabled: !!token,
    });
};

// LOGOUT
export const useLogout = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.clearAuth);

    return useMutation({
        mutationFn: authService.logout,

        onSuccess: () => {
            clearAuth();
            navigate("/signin");
            toast.success("Logged out");
        },
    });
};
