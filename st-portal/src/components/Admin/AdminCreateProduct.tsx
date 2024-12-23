import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const AdminCreateProduct = ({ onReload }: { onReload: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>({
    ProductTypeID: "1", // Giá trị mặc định cho Category
    CompanyId: "1", // Giá trị mặc định cho Company (Apple)
    Status: "0",
    Price: "0", // Giá trị mặc định của Price là 0
    Quantity: "0", // Giá trị mặc định của Quantity là 0 
  });
  const [dataCategory, setDataCategory] = useState<any[]>([]);

  // Fetch danh mục từ API
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch("https://mrkatsu.somee.com/api/type/list");
        const result = await response.json();
        setDataCategory(result.data);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchApi();
  }, []);

  // Tùy chỉnh style của Modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    },
  };

  // Xử lý thay đổi giá trị input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    // Kiểm tra nếu là số hợp lệ (cho Price và Quantity)
    if (name === 'Price' || name === 'Quantity') {
      // Kiểm tra xem giá trị có phải là số hợp lệ không
      if (!/^\d*\.?\d*$/.test(value)) {
        return; // Nếu không phải số hợp lệ, không thay đổi giá trị

      }

    }
    // Kiểm tra nếu là các trường select (Category, Company, Status)
    if (e.target.type === 'select-one') {
      if (data[name] === value) return; // Nếu giá trị không thay đổi, không cập nhật state
    }
    if (e.target.type === 'file') {
      // Nếu là file, lưu tệp vào data
      setData({
        ...data,
        [name]: e.target.files ? e.target.files[0] : null
      });
    } else {
      // Nếu là input bình thường, lưu giá trị vào data
      setData({
        ...data,
        [name]: value
      });
    }
  };

  // Mở Modal
  const openModal = () => {
    setShowModal(true);
  };

  // Đóng Modal
  const closeModal = () => {
    setShowModal(false);
  };

  // --------------------Xử lý khi gửi form ------------------------------//
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Bật trạng thái loading

    const formData = new FormData();
    // Kiểm tra dữ liệu trước khi gửi
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key === 'Images' && data[key]) {
          // Nếu có tệp ảnh, thêm vào FormData
          formData.append(key, data[key]);
        } else {
          // Nếu không phải tệp, thêm dưới dạng text
          formData.append(key, data[key]);
        }
      }
    }

    // Gửi dữ liệu tới API
    fetch("https://mrkatsu.somee.com/api/manage/product/create", {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(`API error: ${err.message || 'Unknown error'}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("API response:", data);
        if (data) {
          setShowModal(false);
          onReload(); // Gọi hàm reload
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tạo mới sản phẩm thành công",
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
      .catch(error => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setIsLoading(false); // Tắt trạng thái loading
      });
  };
  // -------------END xử lý khi gửi form -----------------------//
  return (
    <>
      <button onClick={openModal} className="flex gap-2 items-center text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br dark:focus:ring-purple-800 shadow-sm shadow-purple-500/50 dark:shadow-sm dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Product
      </button>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create Product Modal"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Product Name */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Product Name</label>
              <input type="text" name="ProductName" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Category */}
            {dataCategory.length > 0 && (
              <div className="flex items-center space-x-4">
                <label className="block w-44 text-lg font-medium text-gray-700">Category</label>
                <select name="ProductTypeID"
                  onChange={handleChange}
                  value={data.ProductTypeID}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {dataCategory.map((item) => (
                    <option key={item.typeID} value={item.typeID}>
                      {item.typeName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Price</label>
              <input type="text" name="Price" value={data.Price} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Quantity</label>
              <input type="text" name="Quantity" value={data.Quantity} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Company */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Company</label>
              <select name="CompanyId" value={data.CompanyId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="1">Apple</option>
                <option value="2">Samsung</option>
                <option value="3">Oppo</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Status</label>
              <select name="Status" value={data.Status} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="0">Enable</option>
                <option value="1">Disable</option>
                <option value="2">Pending</option>
              </select>
            </div>

            {/* Image */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Image</label>
              <input type="file" name="Images" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Description */}
            <div className="flex items-center space-x-4">
              <label className="block w-44 text-lg font-medium text-gray-700">Description</label>
              <textarea rows={2} name="Description" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={closeModal} className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500">Cancel</button>

              <button
                type="submit"
                className={`px-6 py-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 ${isLoading
                  ? " animate-pulse cursor-not-allowed"
                  : "  hover:bg-gradient-to-br"
                  } rounded-md`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Create"}
              </button>

            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminCreateProduct;
