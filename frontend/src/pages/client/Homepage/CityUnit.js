import React from "react";

const CityUnit = ({ img, title, description, price, rating, duration }) => {
  return (
    <div className="city-unit">
      <div className="city-image-container">
        <img src={img} alt={title} className="city-unit-image" />
        {price && <div className="city-price">{price}</div>}
      </div>

      <div className="city-content">
        <div className="city-header">
          <h3 className="city-unit-title">{title}</h3>
          {rating && (
            <div className="city-rating">
              <span className="star-icon">★</span>
              <span>{rating}</span>
            </div>
          )}
        </div>

        {duration && (
          <div className="city-duration">
            <span className="duration-icon">🗓️</span> {duration}
          </div>
        )}
        <p className="city-unit-description">{description}</p>

        <div className="city-actions">
          <button className="city-details-btn">View Details</button>
          <button className="city-book-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default CityUnit;
