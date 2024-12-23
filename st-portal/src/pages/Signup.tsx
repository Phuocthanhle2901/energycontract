import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface IUserSignUp {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required("Please enter your email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      ),
    fullName: yup.string().required("Please enter your fullname"),
    password: yup
      .string()
      .required("Please enter your password")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
    rememberMe: yup.boolean(),
  })
  .required();

const SignUp = () => {
  const { t, i18n } = useTranslation("signup");
  const navigate = useNavigate();
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  // const [fullName, setFullname] = useState<string>("");
  // const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorSignup, setErrorSignup] = useState<string>();
  console.log("TCL: SignUp -> errorSignup", errorSignup);
  // const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IUserSignUp>({
    resolver: yupResolver(schema),
  });

  const registerUser = async (data: IUserSignUp) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://mrkatsu.somee.com/api/authentication/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);
      setLoading(false);

      // Redirect to login page
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error.message);
      setErrorSignup(error.message);
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit((data) => registerUser(data));

  const errorMessages = {
    email: {
      required: t("Please enter your email"),
      invalid: t("Please enter a valid email address"),
    },
    fullName: {
      required: t("Please enter your fullname"),
    },
    password: {
      required: t("Please enter your password"),
      pattern: t(
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
      ),
    },
    confirmPassword: {
      required: t("Please confirm your password"),
      match: t("Passwords must match"),
    },
  };

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-3">
      <div className="hidden w-full col-span-2 lg:block">
        <img
          className="w-full h-full"
          src="https://cdn.prod.website-files.com/6479c007a0f97cbf8f3ca330/66e16def5146734ff300ef6a_66e16da382da51f0e435bd5d_Bodrum.jpeg"
          alt=""
        />
      </div>
      <div className="z-10 w-full p-6 pl-14">
        <div className="flex items-start justify-between">
          <h2 className="flex items-center justify-center gap-3 mb-4 text-lg font-bold lg:justify-start">
            <svg
              width="34"
              height="41"
              viewBox="0 0 34 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.0331 0.945374L0.296875 10.8637V23.0708L17.0331 32.9891L30.4588 25.3596V28.9836L17.0331 36.9946L0.296875 26.8855V31.2725L17.0331 41L33.7693 31.2725V19.0653L20.3435 26.8855V23.0708L33.7693 15.0599V10.8637L17.0331 0.945374Z"
                fill="#0156FF"
              />
            </svg>
            Selling Tech APP
          </h2>
          <form className="max-w-sm mx-auto">
            <select
              id="countries"
              className="outline-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={localStorage.getItem("lng") || "en"}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value as "en" | "vi");
                localStorage.setItem("lng", e.target.value);
              }}
            >
              <option disabled>{t("Select your language")}</option>
              <option value="en">🇺🇸&emsp; {t("English")}</option>
              <option value="vi">🇻🇳&emsp;{t("Vietnamese")}</option>
            </select>
          </form>
        </div>

        <div className="text-center ">
          <form onSubmit={onSubmit} className="max-w-[500px] mx-auto my-2">
            <div className="flex flex-col gap-2 mb-4 text-left">
              <label htmlFor="email" className="font-semibold cursor-pointer">
                {t("Email")}
              </label>
              <input
                className={`relative p-2 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 ${
                  errors?.email ? "!border-red-500" : ""
                }`}
                id="Email"
                placeholder={t("Enter your Email")}
                {...register("email")}
                type="text"
              />
              {errors?.email && (
                <p className="text-sm text-red-500">
                  {errors.email.type === "required"
                    ? errorMessages.email.required
                    : errorMessages.email.invalid}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4 text-left">
              <label
                htmlFor="fullName"
                className="font-semibold cursor-pointer"
              >
                {t("Fullname")}
              </label>
              <input
                className={`relative p-2 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 ${
                  errors?.fullName ? "!border-red-500" : ""
                }`}
                id="fullName"
                placeholder={t("Enter your fullname")}
                {...register("fullName")}
                type="text"
              />
              {errors?.fullName && (
                <p className="text-sm text-red-500">
                  {errorMessages.fullName.required}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4 text-left">
              <label
                htmlFor="password"
                className="font-semibold cursor-pointer"
              >
                {t("password")}
              </label>
              <input
                className={`relative w-full p-2 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 ${
                  errors.password ? "!border-red-500" : ""
                }`}
                id="password"
                placeholder={t("Enter your password")}
                type="password"
                {...register("password")}
              />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors.password.type === "required"
                    ? errorMessages.password.required
                    : errorMessages.password.pattern}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4 text-left">
              <label
                htmlFor="confirmPassword"
                className="font-semibold cursor-pointer"
              >
                {t("Confirm password")}
              </label>
              <input
                className={`relative w-full p-2 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 ${
                  errors.confirmPassword ? "!border-red-500" : ""
                }`}
                id="confirmPassword"
                placeholder={t("Confirm your password")}
                type="password"
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.type === "required"
                    ? errorMessages.confirmPassword.required
                    : errorMessages.confirmPassword.match}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full p-3 mt-5 mb-5 font-semibold text-white rounded-lg bg-primary disabled:opacity-50"
              onClick={() => {
                setErrorSignup("");
              }}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : t("Sign Up")}
            </button>
          </form>
        </div>
        <div className="mt-2 text-sm text-center ">
          {t("Already have an account?")}
          <NavLink
            to="/auth/login"
            className="ml-1 font-bold cursor-pointer text-primary"
          >
            {t("Sign In now")}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
