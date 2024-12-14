import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import "../styles/AppLayout.css"
import Footer from "../components/footer";
import Header from "../components/header";
import Menu from "../components/Menu";

const AppLayout = () => {
  // return (
  //   <div className="app-layout">
  //     {/* Sidebar */}
  //     <aside className="sidebar">
  //       <h2>Sidebar</h2>
  //       <ul>
  //         <li><a href="/meeting-rooms">Meeting Rooms</a></li>
  //         <li><a href="/profile">Profile</a></li>
  //         <li><a href="/settings">Settings</a></li>
  //         <li><a href="/logout">Logout</a></li>
  //       </ul>
  //     </aside>

  //     {/* Main Content */}
  //     <div className="main-content">
  //       {/* <header className="header">
  //         <h1>My Application</h1>
  //       </header> */}

  //       <main className="content">
  //         <Outlet /> {/* Nội dung trang sẽ được render tại đây */}
  //       </main>

  //       {/* <footer className="footer">
  //         <p>© 2024 My Application. All rights reserved.</p>
  //       </footer> */}
  //     </div>
  //   </div>
  // );
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <Menu isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}/>
        <main className="flex-grow-1">
          <Outlet />
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default AppLayout;
