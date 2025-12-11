// authService.ts
import {
    loginApi,
    registerApi,
    logoutApi,
    meApi,
    refreshApi,
} from "@/api/auth.api";

export const authService = {
    login: loginApi,
    register: registerApi,
    logout: logoutApi,
    me: meApi,
    refresh: refreshApi,
};
