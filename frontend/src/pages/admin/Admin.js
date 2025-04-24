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

      <div className="dashboard-widgets">
        <h2>Management Modules</h2>
        <div className="widget-grid">
          <div className="widget-card">
            <div className="widget-icon">✈️</div>
            <h3>Top Destinations</h3>
            <p>Manage featured travel destinations.</p>
            <a href="/manage-top-destination" className="widget-button">
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">📍</div>
            <h3>Contact Locations</h3>
            <p>Manage office and contact information.</p>
            <a href="/manage-contact-location" className="widget-button">
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🧳</div>
            <h3>Travel Packages</h3>
            <p>Manage travel packages and offers.</p>
            <a href="/manage-travel-package" className="widget-button">
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🛠️</div>
            <h3>Services</h3>
            <p>Manage services and amenities.</p>
            <a href="/manage-services" className="widget-button">
              Manage
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🗨️</div>
            <h3>Testimonials</h3>
            <p>Manage testimonial</p>
            <a href="/manage-testimonials" className="widget-button">
              Manage
            </a>
          </div>
          <div className="widget-card">
            <div className="widget-icon">❓</div>
            <h3>FAQs</h3>
            <p>Manage frequently asked questions.</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">👥</div>
            <h3>Users</h3>
            <p>Manage user accounts and permissions.</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">🛫</div>
            <h3>Aircraft Fleet</h3>
            <p>Manage aircraft information.</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>

          <div className="widget-card">
            <div className="widget-icon">📊</div>
            <h3>Analytics</h3>
            <p>View booking and traffic statistics.</p>
            <a href="/" className="widget-button widget-button-disabled">
              Coming Soon
            </a>
          </div>
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
