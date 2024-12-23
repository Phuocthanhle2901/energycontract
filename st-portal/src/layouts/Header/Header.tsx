import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../../components/SearchBar";

const Header = () => {
  const { t, i18n } = useTranslation("");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleIconClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const handleLogoClick = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
  //   navigate("/"); // Điều hướng đến trang chủ
  // };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-32 py-2 text-black bg-white shadow-md">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
            navigate("");
          }}
        >
          <svg
            width="95"
            height="80"
            viewBox="0 0 85 69"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.0331 13.9454L25.2969 23.8637V36.0708L42.0331 45.9891L55.4588 38.3596V41.9836L42.0331 49.9946L25.2969 39.8855V44.2725L42.0331 54L58.7693 44.2725V32.0653L45.3435 39.8855V36.0708L58.7693 28.0599V23.8637L42.0331 13.9454Z"
              fill="#0156FF"
            />
          </svg>
          <span className="ml-0 text-xl font-semibold text-gray-700">
            Selling Tech App
          </span>
        </div>

        <div className="flex items-center">
          <SearchBar />
        </div>

        <div className="ml-6" onClick={() => navigate("/auth/login")}>
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14m-9-5h4m-2 0v4m-6-9h12"
              />
            </svg>
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full -top-2 -right-2">
              3
            </span>
          </button>
        </div>

        <div className="relative">
          <div onClick={handleIconClick} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fill-rule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 w-48 p-2 mt-2 bg-white border rounded shadow-lg">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                {t("User information")}
              </button>
            </div>
          )}
        </div>

        <div>
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
      </header>

      <div className="pt-20">{/* Nội dung bên dưới */}</div>
    </>
  );
};

export default Header;
