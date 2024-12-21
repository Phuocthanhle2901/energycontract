import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import "../styles/AppLayout.css"
import Footer from "../components/footer";
import Header from "../components/AdminHeader";
import Menu from "../components/AdminMenu";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <Menu isOpen={isSidebarOpen}/>
        <main className="flex-grow-1">
          <Outlet />
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default AdminLayout;
