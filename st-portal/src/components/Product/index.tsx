import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import LoadingSkeleton from "../Loading/LoadingSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const itemsPerPage = 30;
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
const Product = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);
  console.log("TCL: Product -> itemOffset", itemOffset);
  const [nextPage, setNextPage] = useState<number>(1);

  const { data: products } = useQuery({
    queryKey: ["fetchProduct", nextPage],
    queryFn: (): Promise<any> =>
      fetch(
        `https://mrkatsu.somee.com/api/product/list?page=${nextPage}&pageSize=${itemsPerPage}`
      ).then((res) => {
        return res.json();
      }),
  });
  let dataProduct = products?.data.items;
  let totalPages = products?.data.totalPages;

  const loading = !dataProduct || !Array.isArray(dataProduct);
  useEffect(() => {
    if (!dataProduct || !dataProduct.length) return;
    setPageCount(Math.ceil(totalPages));
  }, [dataProduct]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % totalPages;
    setItemOffset(newOffset);
    setNextPage(event.selected + 1);
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-8 my-5 md:grid-cols-3 lg:grid-cols-5 lg:px-44 product">
        {loading && (
          <>
            {new Array(itemsPerPage).fill(0).map(() => (
              <ProductSkeleton key={v4()}></ProductSkeleton>
            ))}
          </>
        )}
        {!loading &&
          dataProduct?.map((product: IProduct) => (
            <ProductItem
              id={product.id}
              productCode={product.productCode}
              productName={product.productName}
              description={product.description}
              status={product.status}
              companyName={product.companyName}
              productImages={product.productImages}
              price={product.price.toLocaleString()}
              quantity={0}
              releaseDate={""}
              companyId={0}
              typeID={0}
              typeName={""}
              primaryImageUrl={
                product.productImages.find((img) => img.isPrimary)?.imageUrl ||
                ""
              }
            ></ProductItem>
          ))}
      </div>
      <div className="my-5 mt-10">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          className="flex items-center justify-center pagination"
          pageClassName="pagination-item"
          pageLinkClassName="border border-gray-300  hover:bg-primary hover:text-white rounded-md px-4 py-2 transition duration-300 "
          previousClassName="pagination-prev border border-gray-300 bg-white text-gray-700 rounded-md px-4 py-2 transition duration-300 hover:bg-primary hover:bg-primary hover:text-white"
          nextClassName="pagination-next border border-gray-300 bg-white text-gray-700 rounded-md px-4 py-2 transition duration-300 hover:bg-primary hover:bg-primary hover:text-white"
        />
      </div>
    </>
  );
};

export default Product;

export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col p-3 text-white rounded-lg select-none movie-card bg-slate-800">
      <LoadingSkeleton
        width="100%"
        height="200px"
        radius="8px"
        className="mb-8"
      ></LoadingSkeleton>
      <div className="flex flex-col flex-1">
        <h3 className="mb-6 text-xl font-bold text-white">
          <LoadingSkeleton width="100%" height="40px"></LoadingSkeleton>
        </h3>
        <div className="flex flex-col text-sm opacity-50">
          <span className="mb-2">
            <LoadingSkeleton width="50px" height="10px"></LoadingSkeleton>
          </span>
          <span className="mb-2">
            <LoadingSkeleton width="50px" height="10px"></LoadingSkeleton>
          </span>
          <span className="mt-auto ">
            <LoadingSkeleton width="100px" height="10px"></LoadingSkeleton>
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProductItem = ({
  id,
  productCode,
  productName,
  companyName,
  primaryImageUrl,
  price,
}: IProduct) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col px-4 py-4 transition-shadow duration-300 border cursor-pointer border-slate-200 hover:shadow-lg"
      onClick={() => navigate(`/products/${id}`)}
    >
      <div className="mx-auto mb-4">
        <img
          className="rounded-sm aspect-square"
          src={primaryImageUrl}
          alt={productCode}
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="mb-2 text-lg font-semibold text-blue-600 line-clamp-2">
          {productName}
        </h3>
        <div className="mt-auto">
          <h4 className="text-xl font-semibold text-green-500">
            {price} <sup>vnđ</sup>
          </h4>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center justify-center">
              <svg
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.91099 0.173835C6.94815 0.10127 7.05185 0.10127 7.08901 0.173834L8.92922 3.76772C8.94375 3.79609 8.97092 3.81583 9.00239 3.82088L12.989 4.46045C13.0695 4.47337 13.1016 4.572 13.044 4.62976L10.1947 7.49048C10.1722 7.51306 10.1618 7.54501 10.1668 7.57649L10.7904 11.5657C10.803 11.6462 10.7191 11.7072 10.6464 11.6703L7.04522 9.84443C7.0168 9.83002 6.9832 9.83002 6.95478 9.84443L3.35358 11.6703C3.28087 11.7072 3.19697 11.6462 3.20956 11.5657L3.83323 7.57649C3.83816 7.54501 3.82778 7.51306 3.80529 7.49048L0.955954 4.62976C0.898423 4.572 0.93047 4.47337 1.01096 4.46045L4.99761 3.82088C5.02908 3.81583 5.05625 3.79609 5.07078 3.76772L6.91099 0.173835Z"
                  fill="#E9A426"
                />
              </svg>
              <span className="ml-1 text-sm text-gray-600">{productCode}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">{companyName}</p>
        </div>
      </div>
    </div>
  );
};
