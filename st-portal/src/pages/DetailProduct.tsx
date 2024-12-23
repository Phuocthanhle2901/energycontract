import { NavLink, useParams } from "react-router-dom";
import EmblaCarousel from "../components/Carousel/EmblaCarousel";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

import { EmblaOptionsType } from "embla-carousel";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
interface IProduct {
  id: number;
  productCode: string;
  productName: string;
  description: string;
  price: string | number;
  quantity: number;
  status: number;
  releaseDate: string;
  companyId: number;
  companyName: string;
  typeID: number;
  typeName: string;
  productImages: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
  }[];
  primaryImageUrl: string;
}
const OPTIONS: EmblaOptionsType = {};

const DetailProductSkeleton = () => {
  return (
    <div className="px-4 py-10 sm:px-8 md:px-16 lg:px-24">
      <div className="flex flex-row items-center gap-3 mb-10">
        <NavLink
          to="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e2f2fa] cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20 12C20 12.5523 19.5523 13 19 13L5 13C4.44771 13 4 12.5523 4 12C4 11.4477 4.44771 11 5 11L19 11C19.5523 11 20 11.4477 20 12Z"
              fill="#0064D2"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L6.41421 12L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071Z"
              fill="#0064D2"
            />
          </svg>
        </NavLink>
        <p className="text-base text-center">
          <NavLink to="/">Back to previous page </NavLink>
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row md:gap-12 lg:gap-16">
        <div className="flex-1">
          <LoadingSkeleton width="100%" height="500px" className="mb-4" />
        </div>
        <div className="flex-1">
          <LoadingSkeleton width="80%" height="40px" className="mb-5" />
          <LoadingSkeleton width="50%" height="20px" className="mb-4" />
          <LoadingSkeleton width="30%" height="20px" className="mb-4" />
          <LoadingSkeleton width="50%" height="40px" className="mb-4" />
          <LoadingSkeleton width="100%" height="80px" className="mb-4" />
          <div className="flex flex-col items-center gap-4 mt-5 md:flex-row">
            <div className="flex items-center lg:mr-14">
              <LoadingSkeleton width="120px" height="40px" className="mr-2" />
            </div>
            <div className="flex flex-col w-full gap-2 md:flex-row">
              <LoadingSkeleton width="100%" height="40px" className="mb-2" />
              <LoadingSkeleton width="100%" height="40px" className="mb-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const DetailProduct = () => {
  const { productId } = useParams();
  const [count, setCount] = useState(2);
  const { data: product } = useQuery({
    queryKey: ["fetchProduct", productId],
    queryFn: (): Promise<any> =>
      fetch(`https://mrkatsu.somee.com/api/product?id=${productId}`).then(
        (res) => {
          return res.json();
        }
      ),
  });

  if (!product) return <DetailProductSkeleton />;
  const productData: IProduct = product?.data;

  const SLIDES: string[] = []; // Khai báo mảng SLIDES
  console.log("TCL: SLIDES", SLIDES);

  // Lấy imageUrl từ productImages
  if (productData?.productImages) {
    productData.productImages.forEach((image) => {
      SLIDES.push(image.imageUrl);
    });
  }

  return (
    <div className="px-4 pt-5 pb-10 sm:px-8 md:px-16 lg:px-24">
      <div className="flex flex-row items-center gap-3 mb-10">
        <NavLink
          to="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e2f2fa] cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20 12C20 12.5523 19.5523 13 19 13L5 13C4.44771 13 4 12.5523 4 12C4 11.4477 4.44771 11 5 11L19 11C19.5523 11 20 11.4477 20 12Z"
              fill="#0064D2"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L6.41421 12L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071Z"
              fill="#0064D2"
            />
          </svg>
        </NavLink>
        <p className="text-base text-center">
          <NavLink to="/">Back to previous page </NavLink>
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row md:gap-12 lg:gap-16">
        <div className="flex-1">
          <EmblaCarousel slides={SLIDES} options={OPTIONS}>
            {SLIDES.map((slide, index) => (
              <div key={index} className="relative">
                <img
                  className="object-cover w-full rounded-2xl aspect-square"
                  src={slide}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </EmblaCarousel>
        </div>
        <div className="flex-1">
          <h2 className="mb-2 text-3xl font-semibold lg:mb-3 md:text-4xl lg:text-5xl">
            {productData.productName}
          </h2>
          <p className="mb-3 text-sm font-semibold text-gray-700 md:text-base lg:text-lg">
            Manufacturer:{" "}
            <span className="text-primary">{productData.companyName}</span>
          </p>
          <div className="flex gap-1 mb-3">
            <svg
              width="26"
              height="24"
              viewBox="0 0 26 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1631 1.26548C11.8573 -0.346446 14.1427 -0.346442 14.8369 1.26548L16.8564 5.95491C17.1459 6.62726 17.7797 7.0877 18.5086 7.15531L23.5925 7.62683C25.3401 7.78891 26.0463 9.96253 24.7278 11.1208L20.892 14.4906C20.342 14.9737 20.0999 15.7187 20.2609 16.4329L21.3835 21.4137C21.7693 23.1258 19.9203 24.4692 18.4113 23.5731L14.0211 20.9663C13.3917 20.5926 12.6083 20.5926 11.9789 20.9663L7.58872 23.5731C6.07966 24.4692 4.23066 23.1258 4.61654 21.4137L5.73912 16.4329C5.90007 15.7187 5.658 14.9737 5.10803 14.4906L1.27217 11.1208C-0.0463493 9.96253 0.659906 7.78891 2.40745 7.62683L7.49141 7.15531C8.22033 7.0877 8.85407 6.62726 9.14362 5.95491L11.1631 1.26548Z"
                fill="#F2C94C"
              />
            </svg>
            <span>4.5</span>
            <span className="opacity-50">from 392 Reviews</span>
          </div>
          <h3 className="mb-4 text-5xl md:text-6xl">
            {productData.price.toLocaleString()}
            <sup>vnđ</sup>
          </h3>

          <div className="flex flex-col gap-3 mb-10">
            {productData.description}
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex items-center lg:mr-14">
              <button
                onClick={() => {
                  if (count > 1) setCount(count - 1);
                }}
                className="px-4 py-2 font-bold bg-[#e6f0fa] text-primary opacity-50 rounded-l hover:bg-primary hover:opacity-100 hover:text-white transition duration-300 ease-in-out focus:outline-none"
              >
                &minus;
              </button>
              <input
                type="text"
                value={count}
                readOnly
                className="w-12 h-10 text-center border border-gray-200 focus:outline-none"
              />
              <button
                onClick={() => setCount(count + 1)}
                className="px-4 py-2 font-bold bg-[#e6f0fa] text-primary opacity-50 rounded-r rounded-b hover:bg-primary hover:opacity-100 hover:text-white transition duration-300 ease-in-out focus:outline-none"
              >
                +
              </button>
            </div>
            <div className="flex flex-col w-full gap-2 md:flex-row">
              <button className="w-full px-14 py-[10px] text-white rounded-[10px] bg-primary font-semibold hover:bg-opacity-90 transition duration-300 ease-in-out">
                Buy it now
              </button>
              <button className="w-full px-14 py-[10px] rounded-[10px] bg-[#e6f0fa] text-primary font-semibold hover:bg-[#d1e7f0] transition duration-300 ease-in-out">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <Tab description={productData.description}></Tab>
      </div> */}
    </div>
  );
};

export default DetailProduct;
