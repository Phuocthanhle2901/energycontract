import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const AdminEditProduct = ({ product, onReload }: { product: any, onReload: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataCategory, setDataCategory] = useState<any[]>([]);

  const convertStatusToValue = (status: string): string => {
    switch (status) {
      case "Enable":
        return "0";
      case "Disable":
        return "1";
      case "Pending":
        return "2";
      default:
        return "0";
    }
  };

  const [data, setData] = useState({
    ProductId: product?.id || "",
    ProductName: product?.productName || "",
    Description: product?.description || "",
    Price: product?.price || "",
    Quantity: product?.quantity || "",
    Status: convertStatusToValue(product?.status || "Enable"),
    CompanyId: product?.companyId || "1",
    ProductTypeID: product?.typeID || "1",
    Thumbnail: null,
    productImages: product?.productImages || [],
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch("https://mrkatsu.somee.com/api/type/list");
        const result = await response.json();
        setDataCategory(result.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files, type } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? (files?.[0] || null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("ProductId", data.ProductId);
    formData.append("ProductName", data.ProductName);
    formData.append("Description", data.Description);
    formData.append("Price", data.Price);
    formData.append("Quantity", data.Quantity);
    formData.append("Status", data.Status);
    formData.append("CompanyId", data.CompanyId);
    formData.append("ProductTypeID", data.ProductTypeID);
    if (data.Thumbnail) formData.append("Thumbnail", data.Thumbnail);

    try {
      const response = await fetch("https://mrkatsu.somee.com/api/manage/product/update", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật sản phẩm thành công",
        showConfirmButton: false,
        timer: 2000,
      });
      setShowModal(false);
      // Gọi hàm onReload để reset lại dữ liệu
      onReload();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Vui lòng thêm ảnh");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        Update
      </button>

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="ProductName"
              value={data.ProductName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Category</label>
            <select
              name="ProductTypeID"
              value={data.ProductTypeID}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {dataCategory.map((item) => (
                <option key={item.typeID} value={item.typeID}>
                  {item.typeName}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="Price"
              value={data.Price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="Quantity"
              value={data.Quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* COMPANY */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Company</label>
            <select
              name="CompanyId"
              value={data.CompanyId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1">Apple</option>
              <option value="2">Samsung</option>
              <option value="3">Oppo</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Status</label>
            <select
              name="Status"
              value={data.Status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="0">Enable</option>
              <option value="1">Disable</option>
              <option value="2">Pending</option>
            </select>
          </div>

          {/* Thumbnail */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Image</label>
            {data.productImages?.[0]?.imageUrl && (
              <img
                src={data.productImages[0].imageUrl}
                alt="Thumbnail"
                className="w-20 h-20 mb-2 object-cover"
              />
            )}
            <input
              type="file"
              name="Thumbnail"
              onChange={handleChange}
              className="w-9/12 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Description */}
          <div className="flex items-center space-x-4">
            <label className="block w-44 text-lg font-medium text-gray-700">Description</label>
            <textarea
              name="Description"
              value={data.Description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-md bg-gradient-to-r from-green-500 via-green-600 to-green-700
                ${isLoading ? " animate-pulse cursor-not-allowed" : " hover:bg-gradient-to-br"}`}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminEditProduct;
