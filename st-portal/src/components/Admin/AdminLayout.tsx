import AdminHeader from './AdminHeader'
import AdminProductList from './AdminProductList'
import AdminFooter from './AdminFooter'
import { useState } from 'react';


const AdminLayout = () => {
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  }

  return (
    <>
      <AdminHeader onReload={handleReload} />
      <AdminProductList reload={reload} />
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
