import React from "react";
import "./AdminHomepage.css";

const Admin = () => {
  return (
    <div className="admin-dashboard">
      <div className="dem"></div>
      <div className="admin-header">
        <h1>Claude Airlines Admin Dashboard</h1>
        <p>Welcome back, Administrator</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-content">
            <h3>Top Destinations</h3>
            <p className="stat-value">12</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>Contact Locations</h3>
            <p className="stat-value">4</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Users</h3>
            <p className="stat-value">328</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Bookings</h3>
            <p className="stat-value">1,254</p>
          </div>
        </div>
      </div>

      {/* Homepage Management Section */}
      <div className="management-section">
        <h2>Quản lý Homepage</h2>
        <div className="widget-grid">
          <div className="widget-card">
            <div className="widget-icon">✈️</div>
            <h3>Top Destinations</h3>
            <p>Quản lý điểm đến nổi bật</p>
            <a
              href="http://localhost/backend/public/TopDestination/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🧳</div>
            <h3>Travel Packages</h3>
            <p>Quản lý gói du lịch</p>
            <a
              href="http://localhost/backend/public/travelpackage/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🛠️</div>
            <h3>Services</h3>
            <p>Quản lý dịch vụ và tiện ích</p>
            <a
              href="http://localhost/backend/public/Services/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🗨️</div>
            <h3>Testimonials</h3>
            <p>Quản lý đánh giá khách hàng</p>
            <a
              href="http://localhost/backend/public/testimonial/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">📷</div>
            <h3>Image Carousel</h3>
            <p>Quản lý trình chiếu hình ảnh</p>
            <a
              href="http://localhost/backend/public/imagecarousel/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>
        </div>
      </div>

      {/* Contact Management Section */}
      <div className="management-section">
        <h2>Quản lý Contact</h2>
        <div className="widget-grid">
          <div className="widget-card">
            <div className="widget-icon">📍</div>
            <h3>Contact Locations</h3>
            <p>Quản lý địa điểm liên hệ</p>
            <a
              href="http://localhost/backend/public/ContactLocation/manage"
              className="widget-button"
            >
              Manage
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Management Section */}
      <div className="management-section">
        <h2>Quản lý FAQ</h2>
        <div className="widget-grid">
          <div className="widget-card">
            <div className="widget-icon">❓</div>
            <h3>FAQs</h3>
            <p>Quản lý câu hỏi thường gặp</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>
        </div>
      </div>

      {/* About Management Section */}
      <div className="management-section">
        <h2>Quản lý About</h2>
        <div className="widget-grid">
          <div className="widget-card">
            <div className="widget-icon">ℹ️</div>
            <h3>About Us</h3>
            <p>Quản lý thông tin giới thiệu</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>
        </div>
      </div>

      {/* Legacy Links - For Reference */}
      <div className="management-section legacy-links">
        <h2>Legacy Links (For Reference)</h2>
        <div className="legacy-links-container">
          <a href="/manage-top-destination" className="legacy-link">
            Manage Top Destination
          </a>
          <a href="/manage-contact-location" className="legacy-link">
            Manage Contact Location
          </a>
          <a href="/manage-travel-package" className="legacy-link">
            Manage Travel Package
          </a>
          <a href="/manage-services" className="legacy-link">
            Manage Services
          </a>
          <a href="/manage-testimonials" className="legacy-link">
            Manage Testimonials
          </a>
          <a href="/manage-image-carousel" className="legacy-link">
            Manage Image Carousel
          </a>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">Add New Destination</button>
          <button className="action-btn">Add Contact Location</button>
          <button className="action-btn">System Status</button>
          <button className="action-btn">View Logs</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
