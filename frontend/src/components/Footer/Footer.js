import React from "react";
import "./Footer.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPlane,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import airplaneLogo from "../../assets/airplaneLogo.jpg";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <div className="footer-logo-container">
            <img src={airplaneLogo} alt="Logo" className="footer-logo" />
            <h3 className="footer-title">FSTemplate</h3>
          </div>
          <p className="footer-description">
            Your premium airline service providing comfortable and safe travel
            experiences worldwide. Fly with us and discover the world in style.
          </p>
          <div className="footer-social">
            <a
              href="https://facebook.com"
              className="social-icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              className="social-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              className="social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section footer-links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/example">Examples</a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-links">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-list">
            <li>
              <a href="#">Flight Booking</a>
            </li>
            <li>
              <a href="#">Vacation Packages</a>
            </li>
            <li>
              <a href="#">Business Travel</a>
            </li>
            <li>
              <a href="#">Special Offers</a>
            </li>
            <li>
              <a href="#">Loyalty Program</a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h4 className="footer-heading">Contact Us</h4>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>123 Aviation Blvd, Los Angeles, CA 90045</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>+1 (800) 123-4567</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>support@airline.com</span>
          </div>

          <div className="newsletter">
            <h4 className="footer-heading">Subscribe to Newsletter</h4>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          &copy; {year} FSTemplate Airline. All rights reserved.
        </div>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <span className="footer-divider">|</span>
          <a href="#">Terms of Service</a>
          <span className="footer-divider">|</span>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;