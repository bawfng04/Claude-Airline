import React from "react";

const ServiceUnit = ({ img, title, description, features = [], icon }) => {
  return (
    <div className="service">
      <div className="service-image-container">
        <img src={img || "placeholder.jpg"} alt={title} className="service-image" />
      </div>
      <div className="service-content">
        <div className="service-icon">
          <i className={icon}></i>
        </div>
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
      </div>
    </div>
  );
};

export default ServiceUnit;
