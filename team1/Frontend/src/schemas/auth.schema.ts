import * as yup from "yup";

export const loginSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email().required("Email is required"),
    firstName: yup.string().required("First name required"),
    lastName: yup.string().required("Last name required"),
    password: yup.string().min(6).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match"),
});
