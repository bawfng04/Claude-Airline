import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import airplaneLogo from "../../assets/airplaneLogo.jpg";
// import Settings from "../../assets/Settings.png";
import { FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import userDefaultAvatar from "../../assets/userDefaultIcon.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [settingsPopup, setSettingsPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") || "false"
  );
  const headerRef = useRef(null);

  const handleAvatarClick = () => {
    setSettingsPopup(!settingsPopup);
  };

  const handleDetail = () => {
    window.location.href = "/user-detail";
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    window.location.reload();
  };

  // Detect current page for active link styling
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/" || path === "/home") setActiveLink("home");
    else if (path.includes("/about")) setActiveLink("about");
    else if (path.includes("/contact")) setActiveLink("contact");
    else if (path.includes("/faq")) setActiveLink("faq");
    else if (path.includes("/example")) setActiveLink("example");
    else if (path.includes("/login")) setActiveLink("login");
    else if (path.includes("/register")) setActiveLink("register");
  }, []);

  // tính header height
  useEffect(() => {
    const headerHeight = headerRef.current.offsetHeight;
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerHeight}px`
    );
  }, []);

  // Detect scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/home";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // When opening mobile menu, close search if open
    if (!mobileMenuOpen && searchOpen) {
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    // When opening search, close mobile menu if open
    if (!searchOpen && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""}`}
      ref={headerRef}
    >
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo-section">
          <div className="header-logo-container" onClick={handleLogoClick}>
            <img
              src={airplaneLogo}
              alt="Airline Logo"
              className="header-logo"
            />
            <div className="header-title-container">
              <h1 className="header-title">Claude Airlines</h1>
              <span className="header-tagline">Fly with confidence</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className={`header-nav ${mobileMenuOpen ? "show" : ""}`}>
          <ul className="header-nav-list">
            <li className="header-nav-item">
              <a
                href="/home"
                className={`header-nav-link ${
                  activeLink === "home" ? "active" : ""
                }`}
                onClick={closeMenus}
              >
                Home
              </a>
            </li>
            <li className="header-nav-item">
              <a
                href="/about"
                className={`header-nav-link ${
                  activeLink === "about" ? "active" : ""
                }`}
                onClick={closeMenus}
              >
                About
              </a>
            </li>
            <li className="header-nav-item">
              <a
                href="/contact"
                className={`header-nav-link ${
                  activeLink === "contact" ? "active" : ""
                }`}
                onClick={closeMenus}
              >
                Contact
              </a>
            </li>
            <li className="header-nav-item">
              <a
                href="/faq"
                className={`header-nav-link ${
                  activeLink === "faq" ? "active" : ""
                }`}
                onClick={closeMenus}
              >
                FAQ
              </a>
            </li>
            {/* <li className="header-nav-item">
              <a
                href="/example"
                className={`header-nav-link ${
                  activeLink === "example" ? "active" : ""
                }`}
                onClick={closeMenus}
              >
                Example
              </a>
            </li> */}
          </ul>
        </nav>

        {/* Actions Section */}
        <div className="header-actions">
          <button
            className="header-action-btn search-btn"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <FaSearch />
          </button>

          {isLoggedIn === "false" ? (
            <div className="header-auth-buttons">
              <a
                href="/login"
                className={`header-auth-btn login ${
                  activeLink === "login" ? "active" : ""
                }`}
              >
                <FaUser className="auth-icon" />
                <span>Login</span>
              </a>
              <a
                href="/register"
                className={`header-auth-btn register ${
                  activeLink === "register" ? "active" : ""
                }`}
              >
                <span>Register</span>
              </a>
            </div>
          ) : (
            <div className="header-user-icon">
              <img
                className="user-avatar"
                src={userDefaultAvatar}
                alt="user-avatar"
                onClick={handleAvatarClick}
              ></img>
              {settingsPopup && (
                <div className="settings">
                  <button className="settings-buttons" onClick={handleDetail}>
                    Detail
                  </button>
                  <button className="settings-buttons" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="header-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`header-search-overlay ${searchOpen ? "show" : ""}`}>
        <div className="header-search-container">
          <input
            type="text"
            placeholder="Search for destinations, offers, flights..."
            className="header-search-input"
          />
          <button className="header-search-btn">
            <FaSearch />
          </button>
          <button className="header-search-close" onClick={toggleSearch}>
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Book Flight CTA */}
      {/* <div className="header-cta">
        <a href="#" className="book-flight-btn">
          <FaPlane className="book-flight-icon" />
          <span>Book Flight</span>
        </a>
      </div> */}
    </header>
  );
};

export default Header;
