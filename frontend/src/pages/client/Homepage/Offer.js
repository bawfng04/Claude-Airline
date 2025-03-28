import React from "react";
import offer from "../../../assets/offer.webp";

function Offer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  return (
    <div className="offer-container">
      <div className="offer-content">
        <h2 className="offer-title">Never miss an offer</h2>
        <p className="offer-subtitle">
          Subscribe and be the first to receive our exclusive offers.
        </p>

        <form className="offer-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="email"
              className="offer-input"
              placeholder="Email address"
              required
            />
            <input
              type="text"
              className="offer-input"
              placeholder="Preferred city of departure"
              required
            />
          </div>

          <div className="offer-checkbox">
            <input type="checkbox" id="subscribeCheckbox" />
            <label htmlFor="subscribeCheckbox">
              I would like to get offers and news from Qatar Airways. I have
              read and understood the privacy notice.
            </label>
          </div>

          <button type="submit" className="offer-button">
            Subscribe
          </button>
        </form>
      </div>
      <div className="offer-image-section">
        <img src={offer} alt="In-flight offer" className="offer-image" />
      </div>
    </div>
  );
}

export default Offer;
