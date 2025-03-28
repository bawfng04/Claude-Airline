import React from "react";

const ContactUnit = ({ img, title, description, btntext, btnLink }) => {
  return (
    <div className="contact-us-unit">
      <img src={img} alt="contact us" className="contact-us-unit-img" />
      <h2 className="contact-us-unit-title">{title}</h2>
      <p className="contact-us-unit-description">{description}</p>
      <a href={btnLink} className="contact-us-unit-btn">
        {btntext}
      </a>
    </div>
  );
};

export default ContactUnit;
