import { useState, useEffect } from "react";

interface Product {
  name: string;
  price: number;
}

const SearchBar = () => {
  const [query, setQuery] = useState(""); // Chữ user nhập
  const [suggestions, setSuggestions] = useState<Product[]>([]); // Gợi ý từ API

  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };
  // Gọi API mỗi khi query thay đổi
  useEffect(() => {
    // Không hiển thị gợi ý nếu query trống
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const response = await fetch("https://mrkatsu.somee.com/api/product/list-all");
      const data = await response.json();
      const filteredSuggestions = data.filter((item: { name: string }) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ); // Lọc sản phẩm dựa trên query
      setSuggestions(filteredSuggestions); // Cập nhật danh sách gợi ý
    };

    fetchSuggestions();
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto mt-0">
      {/* Thanh tìm kiếm */}
      <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-md">
        <input
          type="text"
          className="flex-grow px-4 text-gray-700 placeholder-gray-400 bg-gray-100 outline-none "
          placeholder="Search entire store here..."
          value={query}
          onChange={handleChange}
        />
        <button
          onClick={() => console.log("Search triggered:", query)} // Nút tìm kiếm (nếu cần action)
          className="text-gray-500 transition hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
      {/* Danh sách gợi ý */}
      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white border rounded-md shadow">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setQuery(suggestion.name)}
            >
              {suggestion.name} - ${suggestion.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
