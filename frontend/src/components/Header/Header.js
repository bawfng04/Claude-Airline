import React from "react";
import "./Header.css";
import Logo from "../../assets/Logo.png";
import Settings from "../../assets/Settings.png";
import airplaneLogo from "../../assets/airplaneLogo.jpg";

const Header = () => {
  const handleLogoClick = () => {
    window.location.href = "/home";
  };

  return (
    <div className="header">
      {/* Header Left Container */}
      <div className="header-left-container">
        <img
          src={airplaneLogo}
          alt="Logo"
          className="header-logo"
          onClick={handleLogoClick}
        />
        <h1 className="header-title">FSTemplate</h1>
      </div>
      {/* Header Middle Container */}
      <div className="header-middle-container">
        {/* Links */}
        <a href="/home" className="header-link">
          Home
        </a>
        <a href="/about" className="header-link">
          About
        </a>
        <a href="/contact" className="header-link">
          Contact
        </a>
        <a href="/faq" className="header-link">
          FAQ
        </a>
        <a href="/example" className="header-link">
          Example
        </a>
        <a href="/login" className="header-link">
          Login
        </a>
        <a href="/register" className="header-link">
          Register
        </a>
        {/* End links */}
      </div>
      {/* Header Right Container */}
      <div className="header-right-container">
        <img src={Settings} alt="Settings" className="header-settings-image" />
      </div>
    </div>
  );
};

export default Header;
