import React from "react";

const ContactUnit = ({ img, title, description, btntext }) => {
  return (
    <div className="contact-us-unit">
      <img src={img} alt="contact us" className="contact-us-unit-img" />
      <h2 className="contact-us-unit-title">{title}</h2>
      <p className="contact-us-unit-description">{description}</p>
      <button className="contact-us-unit-btn">{btntext}</button>
    </div>
  );
};

export default ContactUnit;
