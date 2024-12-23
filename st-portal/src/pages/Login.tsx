import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useMutation } from "@tanstack/react-query";

interface IUser {
  email: string;
  password: string;
  // rememberMe: boolean;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Must be a valid email address")
      .required("Please enter your email"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\s\\p{L}]).{8,}/u,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .matches(
        /^(?!.*(?:qwerty|asdf|zxcv|password|abc))/i,
        "Password cannot contain common keyboard patterns"
      )
      .test(
        "no-unicode",
        "Password cannot contain Unicode characters",
        (value) => {
          return !/[^\x00-\x7F]/.test(value || ""); // Check for non-ASCII characters
        }
      ),
  })

  .required();
const Login = () => {
  const { t, i18n } = useTranslation("login");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorLogin, setErrorLogin] = useState<string>();
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  console.log("TCL: loading", loading);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      const res = await fetch(
        "https://mrkatsu.somee.com/api/authentication/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.text();
    },
    onSuccess: () => {
      console.log("login successfully");
      navigate("/");
    },
    onError: (error) => {
      error && setLoading(false);
      console.log("TCL: error", error);
      setErrorLogin("Invalid username/password.");
    },
  });

  const onSubmit = handleSubmit(async () => {
    setLoading(true);
    mutation.mutate({
      email,
      password,
    });
  });
  const changeLanguages = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  const errorMessages = {
    email: {
      required: t("Please enter your email"),
      invalid: t("Must be a valid email address"),
    },
    password: {
      required: t("Please enter your password"),
      pattern: t("errorLogin"),
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
      <div className="z-10 w-full p-14">
        <div className="flex items-start justify-between">
          <h2 className="flex items-center justify-center gap-3 mb-6 text-lg font-bold lg:justify-start">
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
                changeLanguages(e.target.value as "en" | "vi");
              }}
            >
              <option disabled>{t("Select your language")}</option>
              <option value="en">🇺🇸&emsp; {t("English")}</option>
              <option value="vi">🇻🇳&emsp;{t("Vietnamese")}</option>
            </select>
          </form>
        </div>

        <p className="flex items-center justify-center gap-3 mb-0 text-lg font-bold lg:justify-start">
          {t("Nice to see you again!")}
        </p>
        <div className="text-center ">
          <form onSubmit={onSubmit} className="max-w-[500px] mx-auto my-8">
            <div className="flex flex-col gap-3 mb-5 text-left">
              <label htmlFor="email" className="font-semibold cursor-pointer">
                Email
              </label>
              <input
                className={`relative p-4 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 ${
                  errors?.email ? "!border-red-500" : ""
                }`}
                id="email"
                placeholder={t("placeholderEmail")}
                value={email}
                {...register("email")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
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

            <div className="flex flex-col gap-3 mb-5 text-left">
              <label
                htmlFor="password"
                className="font-semibold cursor-pointer"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  className={`relative w-full p-4 transition-all bg-white border rounded-lg outline-none focus:border-blue-500 
                    ${errors.password ? "!border-red-500" : ""}`}
                  id="password"
                  value={password}
                  placeholder={t("placeholderPassword")}
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true, minLength: 8 })}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />

                <div
                  className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.type === "required"
                    ? errorMessages.password.required
                    : errorMessages.password.pattern}
                </p>
              )}
              {errorLogin && (
                <p className="text-sm text-red-500">{t("errorLogin")}</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-7 text-opacity">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked={rememberMe}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded shrink-0 focus:ring-blue-500"
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-3 text-sm text-gray-800"
                >
                  {t("remember")}
                </label>
              </div>
              <NavLink
                to="/auth/forgetPassword"
                className="text-sm font-semibold text-primary disabled:opacity-50"
              >
                {t("forgotPassword")}
              </NavLink>
            </div>

            <button
              type="submit"
              className="w-full p-3 mt-5 mb-5 font-semibold text-white rounded-lg bg-primary disabled:opacity-50"
              onClick={() => {
                setErrorLogin("");
              }}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : t("SignIn")}
            </button>
          </form>
        </div>
        <div className="text-sm text-center">
          {t("Don't you have an account?")}

          <span
            className="font-bold cursor-pointer text-primary"
            onClick={() => navigate("/auth/signup")}
          >
            <> </>
            {t("SignUpnow")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
