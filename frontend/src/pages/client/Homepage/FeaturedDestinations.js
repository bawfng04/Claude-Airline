import React from "react";
import { FaPlane, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import tokyo from "../../../assets/tokyo.webp";
import newyork from "../../../assets/newyork.jpg";
import barca from "../../../assets/barca.jpg";

const destinations = [
  {
    id: 1,
    city: "Tokyo",
    country: "Japan",
    price: 799,
    image: tokyo,
    departure: "Jun 15",
    return: "Jun 30",
    discount: 15,
  },
  {
    id: 2,
    city: "New York",
    country: "USA",
    price: 649,
    image: newyork,
    departure: "Jul 10",
    return: "Jul 25",
    discount: 0,
  },
  {
    id: 3,
    city: "Barcelona",
    country: "Spain",
    price: 399,
    image: barca,
    departure: "Aug 5",
    return: "Aug 15",
    discount: 22,
  },
];

const FeaturedDestinations = () => {
  return (
    <div className="featured-destinations-container">
      <h2 className="featured-title">Top Destinations</h2>
      <h3 className="featured-subtitle">
        Explore our most popular flight destinations with special fares
      </h3>

      <div className="destinations-grid">
        {destinations.map((destination) => (
          <div className="destination-card" key={destination.id}>
            <div className="destination-image-container">
              <img
                src={destination.image}
                alt={destination.city}
                className="destination-image"
              />
              {destination.discount > 0 && (
                <div className="discount-badge">-{destination.discount}%</div>
              )}
            </div>
            <div className="destination-details">
              <div className="destination-header">
                <h3 className="destination-name">{destination.city}</h3>
                <p className="destination-country">{destination.country}</p>
              </div>
              <div className="destination-price">
                <span className="price-value">${destination.price}</span>
                <span className="price-suffix">round trip</span>
              </div>
              <div className="destination-dates">
                <div className="date-group">
                  <FaCalendarAlt className="date-icon" />
                  <span className="date-label">
                    From {destination.departure}
                  </span>
                </div>
                <FaArrowRight className="date-arrow" />
                <div className="date-group">
                  <FaCalendarAlt className="date-icon" />
                  <span className="date-label">To {destination.return}</span>
                </div>
              </div>
              <button className="book-destination-btn">
                <FaPlane className="btn-icon" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-destinations">
        View All Destinations <FaArrowRight className="btn-arrow" />
      </button>
    </div>
  );
};

export default FeaturedDestinations;
