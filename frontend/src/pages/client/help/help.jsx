import { useState, useEffect } from "react";
import "./help.css";

const help = () => {
  return (
    <div className="help-container">
      <h1 className="help-title">Help Center</h1>
      <p className="help-intro">Welcome to the Airline Help Center. How can we assist you today?</p>
      
      <section className="help-section">
        <h2 className="help-section-title">Frequently Asked Questions</h2>
        <ul className="help-list">
          <li className="help-list-item">How do I book a flight?</li>
          <li className="help-list-item">What is the baggage allowance?</li>
          <li className="help-list-item">How can I change or cancel my booking?</li>
          <li className="help-list-item">What should I do if my flight is delayed?</li>
        </ul>
      </section>
      
      <section className="help-section">
        <h2 className="help-section-title">Contact Us</h2>
        <p className="help-contact-info">If you need further assistance, please contact our support team:</p>
        <ul className="help-contact-list">
          <li className="help-contact-item">Email: support@airlinecompany.com</li>
          <li className="help-contact-item">Phone: +1-800-123-4567</li>
          <li className="help-contact-item">Live Chat: Available 24/7 on our website</li>
        </ul>
      </section>
      
      <section className="help-section">
        <h2 className="help-section-title">Support Hours</h2>
        <p className="help-hours-info">Our support team is available:</p>
        <ul className="help-hours-list">
          <li className="help-hours-item">Monday to Friday: 8:00 AM - 8:00 PM</li>
          <li className="help-hours-item">Saturday and Sunday: 9:00 AM - 5:00 PM</li>
        </ul>
      </section>
    </div>
  );
}

export default help;

