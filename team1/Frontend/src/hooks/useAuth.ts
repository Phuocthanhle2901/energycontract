import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService/authService";
import { useAuthStore } from "@/stores/useAuthStore";

// ============== LOGIN ==============
export const useLogin = () => {
    const navigate = useNavigate();
    const setTokens = useAuthStore((s) => s.setTokens);

    return useMutation({
        mutationFn: authService.login,

        onSuccess: (res) => {
            setTokens({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
            });

            toast.success("Login successful!");
            navigate("/home");
        },

        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Login failed!");
        }
    });
};

// ============== REGISTER ==============
export const useRegister = () => {
    return useMutation({
        mutationFn: authService.register,

        onSuccess: () => toast.success("Register successful!"),
        onError: () => toast.error("Register failed!")
    });
};

// ============== ME ==============
export const useUser = () => {
    const token = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: ["me"],
        queryFn: authService.me,
        enabled: !!token,
    });
};

// ============== LOGOUT ==============
export const useLogout = () => {
    const navigate = useNavigate();
    const clearTokens = useAuthStore((s) => s.clearTokens);

    return useMutation({
        mutationFn: authService.logout,

        onSuccess: () => {
            clearTokens();
            toast.success("Logged out");
            navigate("/signin");
        }
    });
};
