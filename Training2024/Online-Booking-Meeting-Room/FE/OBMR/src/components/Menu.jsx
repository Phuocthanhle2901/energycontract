import React, { useEffect, useRef } from 'react';

const Menu = ({ isOpen, setIsOpen }) => {
  const menuRef = useRef(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, setIsOpen]);

  return (
    <aside
      ref={menuRef}
      className={`bg-light p-3 position-fixed top-0 start-0 h-100 ${isOpen ? 'd-block' : 'd-none'}`}
      style={{ width: '250px', zIndex: '100' }}
    >
      <h2 className="fs-5">Menu</h2>
      <ul className="list-unstyled">
        <li>
          <button className="btn btn-link" onClick={() => setIsOpen(false)}>
            <a href="/login">Calender</a>
          </button>
        </li>
        <li>
          <button className="btn btn-link" onClick={() => setIsOpen(false)}>
            Booking
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Menu;
