import React, { useState } from 'react';
import Modal from 'react-modal';

const AdminDetailsProduct = ({ product }: { product: any }) => {
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Hàm để gọi API lấy chi tiết sản phẩm
  const fetchProductDetails = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://mrkatsu.somee.com/api/customer/product?id=${id}`);
      const result = await response.json();
      if (result.success) {
        setProductDetails(result.data);
        setShowModal(true);
      } else {
        console.error('Failed to fetch product details:', result);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => fetchProductDetails(product.id)}
        className={`text-white bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center${isLoading ? " animate-pulse cursor-not-allowed" : " hover:bg-gradient-to-br"}`}
      >
        {isLoading ? "Updating..." : "Details"}
      </button>

      {showModal && productDetails && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              background: '#fdf2f8',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <div className='w-96 flex flex-col justify-center'>
            <h2 className="text-2xl font-bold mb-4 text-center text-pink-700">Product Details</h2>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">ID:</strong> {productDetails.id}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Product Code:</strong> {productDetails.productCode}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Product Name:</strong> {productDetails.productName}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Category:</strong> {productDetails.typeName}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Price:</strong> {productDetails.price}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Quantity:</strong> {productDetails.quantity}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Status:</strong> {productDetails.status}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Release Date:</strong> {productDetails.releaseDate}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Company:</strong> {productDetails.companyName}</p>
            <p className="text-pink-500 font-bold m-1"><strong className="text-pink-700">Description:</strong> {productDetails.description}</p>
            {productDetails.productImages?.[0]?.imageUrl && (
              <img
                src={productDetails.productImages[0].imageUrl}
                alt="Product"
                className="w-32 h-32 object-cover mt-4 mx-auto border border-pink-500 "
              />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="text-white bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminDetailsProduct;
