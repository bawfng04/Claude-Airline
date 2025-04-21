import React, { useState, useEffect } from "react";
import { FaPlane, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { GET_TOP_DESTINATION_API, API_URL } from "../../../bang_config/apis";
// import './FeaturedDestinations.css';

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State mới để kiểm soát hiển thị

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(GET_TOP_DESTINATION_API);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.status === 200 && Array.isArray(result.data)) {
          const processedData = result.data.map((dest) => ({
            ...dest,
            fullImagePath: dest.destination_image
              ? `${API_URL}${dest.destination_image}`
              : null,
            departure: dest.destination_begin
              ? dest.destination_begin.split(" ")[0]
              : "N/A",
            return: dest.destination_end
              ? dest.destination_end.split(" ")[0]
              : "N/A",
            discount: dest.destination_offer
              ? parseInt(dest.destination_offer.match(/\d+/)?.[0] || "0", 10)
              : 0,
          }));
          setDestinations(processedData);
        } else {
          throw new Error(result.message || "Failed to fetch valid data");
        }
      } catch (err) {
        console.error("Error fetching featured destinations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Hàm xử lý việc hiển thị/ẩn bớt
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Xác định danh sách cần hiển thị
  const displayedDestinations = showAll
    ? destinations
    : destinations.slice(0, 3);

  if (loading) {
    return (
      <div className="featured-destinations-container">
        <p>Loading destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-destinations-container">
        <p>Error loading destinations: {error}</p>
      </div>
    );
  }

  return (
    <div className="featured-destinations-container">
      <h2 className="featured-title">Top Destinations</h2>
      <h3 className="featured-subtitle">
        Explore our most popular flight destinations with special fares
      </h3>

      <div className="destinations-grid">
        {/* Map qua mảng displayedDestinations */}
        {displayedDestinations.map((destination) => (
          <div className="destination-card" key={destination.id}>
            <div className="destination-image-container">
              <img
                src={destination.fullImagePath || "placeholder.jpg"}
                alt={destination.destination_name}
                className="destination-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "placeholder.jpg";
                }}
              />
              {destination.discount > 0 && (
                <div className="discount-badge">-{destination.discount}%</div>
              )}
            </div>
            <div className="destination-details">
              <div className="destination-header">
                <h3 className="destination-name">
                  {destination.destination_name}
                </h3>
                <p className="destination-country">
                  {destination.destination_country}
                </p>
              </div>
              <div className="destination-price">
                <span className="price-value">
                  ${parseFloat(destination.destination_price).toFixed(2)}
                </span>
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

      {/* Chỉ hiển thị nút nếu có nhiều hơn 3 địa điểm */}
      {destinations.length > 3 && (
        <button className="view-all-destinations" onClick={toggleShowAll}>
          {showAll ? "Show Less Destinations" : "View All Destinations"}
          <FaArrowRight className="btn-arrow" />
        </button>
      )}
    </div>
  );
};

export default FeaturedDestinations;
