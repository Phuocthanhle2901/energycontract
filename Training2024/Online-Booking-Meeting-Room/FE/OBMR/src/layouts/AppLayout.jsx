import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import "../styles/AppLayout.css"
import Footer from "../components/footer";
import Header from "../components/header";
import Menu from "../components/Menu";

const AppLayout = () => {

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        {/* <Menu isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}/> */}
        <main className="flex-grow-1">
          <Outlet context={{ isSidebarOpen, toggleSidebar }}/>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default AppLayout;
