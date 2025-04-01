import React, { useState } from "react";
import hanoi from "../../../assets/hanoi.jpg";
import paris from "../../../assets/paris.jpg";
import london from "../../../assets/london.jpeg";
import CityUnit from "./CityUnit";

const NextTrip = () => {
  const [activeCategory, setActiveCategory] = useState("popular");

  const categories = [
    { id: "popular", name: "Popular Destinations" },
    { id: "asia", name: "Asia" },
    { id: "europe", name: "Europe" },
    { id: "offers", name: "Special Offers" },
  ];

  return (
    <section className="next-trip">
      <div className="next-trip-header">
        <h2>Start planning your next trip</h2>
        <p className="next-trip-subtitle">
          Thinking of travelling somewhere soon? Here are some options to help
          you get started.
        </p>
      </div>

      <div className="destination-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="cities">
        <CityUnit
          img={hanoi}
          title="Hanoi"
          description="Explore the rich culture and history of Vietnam."
          price="$499"
          rating={4.7}
          duration="5 days"
        />
        <CityUnit
          img={paris}
          title="Paris"
          description="Visit the Eiffel Tower and enjoy the delicious pastries."
          price="$899"
          rating={4.9}
          duration="7 days"
        />
        <CityUnit
          img={london}
          title="London"
          description="Experience the British culture and history."
          price="$799"
          rating={4.8}
          duration="6 days"
        />
      </div>

      <button className="view-all-btn">
        View All Destinations <span className="view-all-icon">→</span>
      </button>
    </section>
  );
};

export default NextTrip;
