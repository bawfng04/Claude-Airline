import React from "react";
import inflight from "../../../assets/inflight-entertaining.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";
import ServiceUnit from "./ServiceUnit";

const ServicesSection = () => {
  return (
    <section className="services-section">
      <h2 className="services-title">Our Premium Services</h2>
      <p className="services-subtitle">
        Experience the comfort and luxury with our exclusive in-flight services
        designed to make your journey memorable.
      </p>
      <div className="services">
        <ServiceUnit
          img={inflight}
          title="Inflight Entertainment"
          description="Enjoy the latest movies, TV shows, and music with our state-of-the-art entertainment system."
          icon="fas fa-film"
          features={[
            "Over 100 movies available",
            "Live TV streaming",
            "Premium music collection",
            "Games for all ages",
          ]}
        />
        <ServiceUnit
          img={comfortable}
          title="Comfortable Seating"
          description="Relax in our ergonomically designed seats with extra legroom for maximum comfort throughout your flight."
          icon="fas fa-couch"
          features={[
            "Adjustable headrests",
            "Extended legroom",
            "Reclining capabilities",
            "USB charging ports",
          ]}
        />
        <ServiceUnit
          img={meal}
          title="Gourmet Dining"
          description="Savor delicious meals prepared by top chefs using fresh, high-quality ingredients for a memorable dining experience."
          icon="fas fa-utensils"
          features={[
            "Chef-prepared meals",
            "Special dietary options",
            "Premium beverage selection",
            "Complimentary snacks",
          ]}
        />
      </div>
    </section>
  );
};

export default ServicesSection;
