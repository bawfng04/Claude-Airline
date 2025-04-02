import React from "react";
import "./Homepage.css";
import Offer from "./Offer";
import TravelPackage from "./TravelPackage";
import HeaderHomepage from "./HeaderHomepage";
import Chom from "./Chom";
import Testimonials from "./Testimonials";
import FeaturedDestinations from "./FeaturedDestinations";
import PromotionCountdown from "./PromotionCountdown";
import NextTrip from "./NextTrip";
import ServersSection from "./ServicesSection";
import ImageCarousel from "./ImageCarousel";

const Homepage = () => {
  return (
    <div className="homepage">
      <HeaderHomepage />
      <section className="homepage-section">
        <h2>Book Your Flight</h2>
        <form className="booking-form">
          <input type="text" placeholder="From" />
          <input type="text" placeholder="To" />
          <input type="date" placeholder="Departure Date" />
          <input type="date" placeholder="Return Date" />
          <button type="submit">Search Flights</button>
        </form>
      </section>
      <section className="featured-destinations-section">
        <FeaturedDestinations />
      </section>

      <PromotionCountdown />
      <NextTrip />

      <section className="travel-package-section">
        <TravelPackage />
      </section>
      <ImageCarousel />
      <Testimonials />
      <ServersSection />
      <section className="chom-section">
        <h2>Save more with us</h2>
        <Chom />
      </section>

      <section className="offer-section">
        <Offer />
      </section>
      <section className="homepage-section map-section">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0983843711947!2d106.80489276947515!3d10.880121246545917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a5568c997f%3A0xdeac05f17a166e0c!2sHo%20Chi%20Minh%20city%20University%20of%20Technology!5e0!3m2!1sen!2s!4v1743141496906!5m2!1sen!2s"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="homepage-map"
            title="map"
          ></iframe>
        </div>
      </section>
      <footer className="homepage-footer">
        <p>&copy; 2025 Our Airline. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
