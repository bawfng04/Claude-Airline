import React from "react";
import "./Homepage.css";
import HomepageAirplaneImage from "../../../assets/homepage-airplane-image.png";
import hanoi from "../../../assets/hanoi.jpg";
import paris from "../../../assets/paris.jpg";
import london from "../../../assets/london.jpeg";
import inflight from "../../../assets/inflight-entertaining.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";
import CityUnit from "./CityUnit";
import ServiceUnit from "./ServiceUnit";
import Offer from "./Offer";
import TravelPackage from "./TravelPackage";

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <img
          src={HomepageAirplaneImage}
          alt="AirplaneImage"
          className="airplane-image"
        />
        <div className="header-content">
          <h1>Welcome to Our Airline</h1>
          <p>Experience the best in class service and comfort.</p>
        </div>
      </header>
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
      <section className="next-trip">
        <h2>Start planning your next trip</h2>
        <h3>
          Thinking of travelling somewhere soon? Here are some options to help
          you get started.
        </h3>
        <div className="cities">
          <CityUnit
            img={hanoi}
            title="Hanoi"
            description="Explore the rich culture and history of Vietnam."
          />
          <CityUnit
            img={paris}
            title="Paris"
            description="Visit the Eiffel Tower and enjoy the delicious pastries."
          />
          <CityUnit
            img={london}
            title="London"
            description="Experience the British culture and history."
          />
        </div>
      </section>
      <section className="travel-package-section">
        <TravelPackage />
      </section>
      <section className="homepage-section">
        <h2>Our Services</h2>
        <div className="services">
          <ServiceUnit
            img={inflight}
            title="Inflight Entertainment"
            description="Enjoy the latest movies, TV shows, and music."
          />
          <ServiceUnit
            img={comfortable}
            title="Comfortable Seating"
            description="Relax in our comfortable seats with extra legroom."
          />
          <ServiceUnit
            img={meal}
            title="Delicious Meals"
            description="Enjoy our delicious meals prepared by top chefs."
          />
        </div>
      </section>
      <section className="offer-section">
        <Offer />
      </section>
      <section className="homepage-section map-section">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6091242787!2d107.57311654129782!3d-6.903273917028756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1633023222539!5m2!1sen!2sid"
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
