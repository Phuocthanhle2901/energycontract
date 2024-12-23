import React from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const AdminDeleteProduct = ({ product, onReload }: { product: any, onReload: () => void }) => {

  const handleDelete = () => {
    console.log(product.id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",

    }).then((result) => {
      if (result.isConfirmed) {
        const response = fetch(`https://mrkatsu.somee.com/api/manage/product?productId=${product.id}`, {
          method: "DELETE"
        });


        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",

        });

        setTimeout(() => {
          onReload();
        }, 3000);

      }


    });
  }

  return (
    <>
      <button onClick={handleDelete} className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br dark:focus:ring-red-800 shadow-sm shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        Delete</button>
    </>
  )
}

export default AdminDeleteProduct