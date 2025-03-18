import React from "react";

const CityUnit = ({ img, title, description }) => {
  return (
    <div className="city-unit">
      <img src={img} alt={title} className="city-unit-image" />
      <h3 className="city-unit-title">{title}</h3>
      <p className="city-unit-description">{description}</p>
    </div>
  );
};

export default CityUnit;
