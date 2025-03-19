import React from "react";
import "./ContactPage.css";
import ContactUnit from "./ContactUnit";
import phone from "../../../assets/phone.png";
import email from "../../../assets/email.png";

const ContactPage = () => {
  return (
    <div className="contact-us-container">
      <h1 className="contact-us-title">Contact Us</h1>
      <div className="contact-units-wrapper">
        <ContactUnit
          img={phone}
          title="Phone"
          description="Call us for any queries, we are available 24/7. Our customer service team is ready to assist you with any questions."
          btntext="Call Now"
        />
        <ContactUnit
          img={email}
          title="Email"
          description="Email us for any queries, we will get back to you as soon as possible. We typically respond within 24 hours."
          btntext="Email Now"
        />
      </div>
    </div>
  );
};

export default ContactPage;
