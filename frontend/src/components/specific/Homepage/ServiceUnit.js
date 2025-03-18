import React from "react";

const ServiceUnit = ({ img, title, description }) => {
  return (
    <div className="service">
      <h3 className="service-title">{title}</h3>
      <img src={img} alt={title} className="service-image" />
      <p className="service-description">{description}</p>
    </div>
  );
};

export default ServiceUnit;
