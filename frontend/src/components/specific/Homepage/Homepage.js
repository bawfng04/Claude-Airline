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
      <footer className="homepage-footer">
        <p>&copy; 2025 Our Airline. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
