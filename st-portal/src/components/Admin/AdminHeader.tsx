
import React from 'react';
import AdminCreateProduct from './AdminCreateProduct';


const AdminHeader: React.FC<{ onReload: () => void }> = ({ onReload }) => {
  return (

    <>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 sticky top-0 z-999">

        <div className="text-2xl uppercase font-bold text-black cursor-pointer hover:scale-110">
          hi admin@.@
        </div>


        <div className="flex space-x-4">
          <button className="flex gap-2 items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 shadow-sm shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Import

          </button>
          <button className="flex gap-2 items-center text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700  hover:bg-gradient-to-br dark:focus:ring-sky-800 shadow-sm shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>

            Export
          </button>
          {/* Truyền onReload vào AdminCreateProduct */}
          <AdminCreateProduct onReload={onReload} />
        </div>
      </div>
    </>

  );
};

export default AdminHeader;
