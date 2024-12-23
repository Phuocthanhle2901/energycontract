import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import AdminEditProduct from './AdminEditProduct';
import AdminDeleteProduct from './AdminDeleteProduct';
import AdminDetailsProduct from './AdminDetailsProduct';


type Product = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  status: string;
  productImages: { imageUrl: string }[];
  releaseDate: string;
};

const AdminProductList: React.FC<{ reload: boolean }> = ({ reload }) => {
  const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm
  const [pageCount, setPageCount] = useState<number>(0); // Số trang
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState<string>(''); // Từ khóa tìm kiếm
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // Từ khóa với debounce
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); // Thời gian debounce

  // Fetch API data
  const fetchProducts = async (page: number, search: string) => {
    setLoading(true); // Bật trạng thái loading
    try {
      const pageSize = 5; // Mỗi trang 5 sản phẩm
      const response = await fetch(`https://mrkatsu.somee.com/api/customer/product/list?page=${page}&pageSize=${pageSize}&search=${search}`);
      const data = await response.json();

      // Kiểm tra dữ liệu có đúng kiểu và không phải undefined
      if (data.success && data.data && Array.isArray(data.data.items)) {
        setProducts(data.data.items); // Lưu dữ liệu sản phẩm vào state
        setPageCount(data.data.totalPages); // Cập nhật tổng số trang
      } else {
        setProducts([]); // Nếu không có dữ liệu hoặc dữ liệu sai kiểu, reset danh sách sản phẩm
        setPageCount(0); // Reset số trang
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Load dữ liệu khi trang hoặc từ khóa thay đổi
  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, reload]);

  // Xử lý sự kiện khi phân trang
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // Chuyển số trang về từ 1
  };

  // Xử lý tìm kiếm với debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // Nếu có timeout cũ, xóa đi
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Đặt timeout mới để trì hoãn việc gọi API
    const newTimeout = setTimeout(() => {
      setDebouncedSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm với độ trễ
    }, 2000); // 2000ms (2 giây)

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      {/* ---------------------------------SEARCH BAR------------------------------------*/}
      <div className="flex justify-center items-center p-4 w-full ">
        <div
          className="relative border w-[480px] bg-white  rounded-2xl shadow-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-lg"
        >
          <div
            className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none "
          >
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className=" w-full pl-8 pr-24 py-3 text-xl text-gray-700 bg-transparent rounded-lg focus:outline-none"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            onClick={() => fetchProducts(1, searchTerm)}
            disabled={!searchTerm.trim()}  // Nút sẽ bị vô hiệu hóa nếu searchTerm rỗng
            className={`absolute right-1 uppercase top-1 bottom-1 px-6 bg-gradient-to-r ${!searchTerm.trim() ? 'from-gray-400 to-gray-500 cursor-not-allowed' : 'from-blue-500 via-blue-600 to-blue-700'
              } text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600`}
          >
            search
          </button>
        </div>
      </div>
      {/* ---------------------------------END SEARCH BAR------------------------------------*/}
      <div className="overflow-x-auto m-4 border border-gray-100">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 uppercase">
              <th className="p-4"></th>
              <th className="p-4">Name</th>
              <th className="p-4">In stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Release Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-600 animate-bounce [animation-delay:.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:.7s]"></div>
                  </div>
                </td>
              </tr>
            ) : (
              products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 text-center">
                      <img
                        src={product.productImages[0]?.imageUrl}
                        alt={product.productName}
                        className="w-15 h-20 object-cover aspect-square"
                      />
                    </td>
                    <td className="p-4 text-center">{product.productName}</td>
                    <td className="p-4 text-center">{product.quantity}</td>
                    <td className="p-4 text-center">{product.price} VND</td>
                    <td className="p-4 text-center">
                      <span className={`font-semibold ${product.status === "Enable" ? 'text-green-500' : product.status === "Disable" ? 'text-red-500' : product.status === "Pending" ? 'text-blue-500' : ''}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">{product.releaseDate}</td>
                    <td className="p-4 text-center">
                      <AdminEditProduct product={product} onReload={() => fetchProducts(currentPage, debouncedSearchTerm)} />
                      <AdminDeleteProduct product={product} onReload={() => fetchProducts(currentPage, debouncedSearchTerm)} />
                      <AdminDetailsProduct product={product} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center">Không có sản phẩm</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div>
        <ReactPaginate
          previousLabel={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 hover:text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
            </svg>
          }
          nextLabel={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 hover:text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
            </svg>
          }
          pageCount={pageCount}
          onPageChange={handlePageChange}
          breakLabel="..."
          containerClassName="pagination m-4"
          pageClassName="page-item hover:text-gray-500"
          pageLinkClassName="page-link"
          activeClassName="text-gray-500 font-bold scale-125 duration-200 stroke-blue-500"
          disabledClassName="disabled"
        />
      </div>
    </>
  );
};

export default AdminProductList;
