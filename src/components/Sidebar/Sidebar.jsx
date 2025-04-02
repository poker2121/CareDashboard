import { useState } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  FaBars,
  FaHome,
  FaBoxOpen,
  FaThList,
  FaNewspaper,
  FaBell,
  FaSignOutAlt,
  FaPercent,
  FaShoppingCart,
  FaUsers
} from "react-icons/fa";
import "./Sidebar.css";


const Sidebar = () => {
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <FaHome size={17} />, text: "Dashboard", path: "/" },
    { icon: <FaBoxOpen size={17} />, text: "Products", path: "/products" },
    { icon: <FaThList size={17} />, text: "Categories", path: "/categories" },
    { icon: <FaUsers size={17} />, text: "Customers", path: "/customers" }, 
    { icon: <FaNewspaper size={17} />, text: "Blogs", path: "/blogs" },
    { icon: <FaShoppingCart size={17} />, text: "Orders", path: "/orders" },
    { icon: <FaPercent size={17} />, text: "Coupones", path: "/discounts" },
    { icon: <FaSignOutAlt size={17} />, text: "Logout", path: "/logout" }
    
];


  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile-admin');
    if (window.innerWidth < 992) {
      setIsOpen(false); 
    }
  };

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <FaBars size={20} />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <h3>Care <span className="logo">+</span></h3>
        </div>
        <div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" className="user-avatar" />
          <span>Admin Name</span>
          
        </div>

        <Nav className="flex-column">
          <div className="nav-section">
            <span className="nav-label">DASHBOARD</span>
            {menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                className="nav-item"
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                <span className="nav-text">{item.text}</span>
              </Nav.Link>
            ))}
          </div>
        </Nav>
      </div>
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
