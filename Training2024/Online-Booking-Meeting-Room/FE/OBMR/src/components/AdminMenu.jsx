import React from 'react';
import classNames from 'classnames';
import {
    AppstoreOutlined,
    UserOutlined,
    ContainerOutlined,
} from '@ant-design/icons';
import { Menu as AntMenu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import "../styles/AdminMenu.css"; // Tạo file CSS nếu cần

const Menu = ({ isOpen }) => {
    const location = useLocation(); // Lấy thông tin URL hiện tại
    const currentPath = location.pathname; // Đường dẫn hiện tại

    const menuItems = [
        {
            key: '/admin',
            icon: <AppstoreOutlined />,
            label: <NavLink to="/admin">Room</NavLink>,
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: <NavLink to="/admin/users">Users</NavLink>,
        },
        {
            key: '3',
            icon: <ContainerOutlined />,
            label: 'Settings',
        },
    ];

    return (
        <div
            className={classNames('sidebarAdmin', {
                'sidebar-open': isOpen,
                'sidebar-closed': !isOpen,
            })}
        >
            <AntMenu
                defaultSelectedKeys={[currentPath]}
                mode="inline"
                theme="light"
                items={menuItems}
            />
        </div>
    );
};

export default Menu;
