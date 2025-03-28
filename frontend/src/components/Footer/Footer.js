import React from "react";
import "./Footer.css";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li>
              <a href="#">Giới thiệu công ty</a>
            </li>
            <li>
              <a href="#">Đội bay</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/example">Example</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/Register">Register</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Hộ trỡ</h3>
          <ul>
            <li>
              <a href="/help">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="/Register">Liên hệ với chúng tôi</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a href="#https://www.facebook.com/bawfng04">
              <FaFacebook />
            </a>
            <a href="#https://www.instagram.com/bawfng04/">
              <FaInstagram />
            </a>
            <a href="#https://www.linkedin.com/in/bawfng04/">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
