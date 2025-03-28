import React from "react";
import "./AboutUs.css";
import {
  FaPlane,
  FaMedal,
  FaUsers,
  FaCheckCircle,
  FaHistory,
} from "react-icons/fa";
import airplaneLogo from "../../../assets/airplaneLogo.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-title">About Our Airline</h1>
          <p className="about-subtitle">
            We've been connecting people and places for over 25 years
          </p>
        </div>
      </div>

      <section className="about-section">
        <div className="about-intro">
          <div className="about-intro-icon">
            <FaPlane />
          </div>
          <h2>Our Story</h2>
          <p>
            Founded in 1998, our airline began with a small fleet of just 3
            aircraft serving domestic routes. Today, we've grown to become one
            of Southeast Asia's leading carriers, connecting passengers to over
            100 destinations worldwide with a modern fleet of 78 aircraft.
          </p>
          <p>
            Throughout our journey, we've remained committed to our founding
            vision: making air travel accessible, comfortable, and enjoyable for
            everyone while upholding the highest standards of safety and
            service.
          </p>
        </div>
      </section>

      <section className="about-section about-mission-vision">
        <div className="about-wrapper">
          <div className="about-mission">
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>
                To connect people and places with safe, reliable air travel that
                is accessible to all, while delivering exceptional service that
                exceeds expectations at every step of the journey.
              </p>
            </div>
          </div>
          <div className="about-vision">
            <div className="about-card">
              <h3>Our Vision</h3>
              <p>
                To be recognized globally as the airline of choice, known for
                innovation, sustainability, and a customer experience that sets
                the industry standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-values">
        <h2>Our Core Values</h2>
        <div className="values-container">
          <div className="value-item">
            <div className="value-icon">
              <FaUsers />
            </div>
            <h3>Customer Focus</h3>
            <p>
              We put our passengers at the heart of everything we do, creating
              experiences tailored to their needs.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <FaCheckCircle />
            </div>
            <h3>Safety First</h3>
            <p>
              Safety is non-negotiable, and we maintain the highest standards in
              all our operations.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <FaMedal />
            </div>
            <h3>Excellence</h3>
            <p>
              We strive for excellence in every aspect of our service,
              continuously improving to exceed expectations.
            </p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <FaHistory />
            </div>
            <h3>Reliability</h3>
            <p>
              We keep our promises to passengers, with punctuality and
              dependability in all our operations.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section about-leadership">
        <h2>Our Leadership Team</h2>
        <div className="leadership-container">
          <div className="leader-card">
            <div className="leader-image">
              <img src={airplaneLogo} alt="CEO" />
            </div>
            <h3>John Smith</h3>
            <p className="leader-position">Chief Executive Officer</p>
            <p className="leader-bio">
              With 20+ years in aviation, John has transformed our airline into
              a global carrier known for excellence and innovation.
            </p>
          </div>
          <div className="leader-card">
            <div className="leader-image">
              <img src={airplaneLogo} alt="COO" />
            </div>
            <h3>Sarah Johnson</h3>
            <p className="leader-position">Chief Operations Officer</p>
            <p className="leader-bio">
              Sarah oversees our daily operations, ensuring we maintain the
              highest standards of service and efficiency.
            </p>
          </div>
          <div className="leader-card">
            <div className="leader-image">
              <img src={airplaneLogo} alt="CXO" />
            </div>
            <h3>Michael Chen</h3>
            <p className="leader-position">Chief Experience Officer</p>
            <p className="leader-bio">
              Michael leads our customer experience initiatives, focusing on
              creating memorable journeys for all passengers.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section about-achievements">
        <h2>Our Achievements</h2>
        <div className="achievements-timeline">
          <div className="achievement-item">
            <div className="achievement-year">2023</div>
            <div className="achievement-content">
              <h3>Best Airline in Southeast Asia</h3>
              <p>
                Awarded by Skytrax World Airline Awards for the third
                consecutive year
              </p>
            </div>
          </div>
          <div className="achievement-item">
            <div className="achievement-year">2022</div>
            <div className="achievement-content">
              <h3>Best Cabin Crew</h3>
              <p>Recognized for exceptional service and professionalism</p>
            </div>
          </div>
          <div className="achievement-item">
            <div className="achievement-year">2021</div>
            <div className="achievement-content">
              <h3>Most Sustainable Airline</h3>
              <p>
                For our commitment to reducing carbon emissions and
                environmental impact
              </p>
            </div>
          </div>
          <div className="achievement-item">
            <div className="achievement-year">2020</div>
            <div className="achievement-content">
              <h3>Best Inflight Entertainment</h3>
              <p>
                For our innovative entertainment system and content selection
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-experience">
        <h2>The Airline Experience</h2>
        <div className="experience-container">
          <div className="experience-image">
            <img src={comfortable} alt="Comfortable seating" />
          </div>
          <div className="experience-content">
            <h3>Comfort Above All</h3>
            <p>
              Our aircraft are equipped with ergonomically designed seats,
              providing optimal comfort even on long-haul flights. With generous
              legroom and adjustable headrests, you can relax and arrive at your
              destination feeling refreshed.
            </p>
            <p>
              Premium cabins feature fully-flat beds and private suites for an
              unparalleled travel experience.
            </p>
          </div>
        </div>
        <div className="experience-container reverse">
          <div className="experience-content">
            <h3>Culinary Excellence</h3>
            <p>
              We believe that airline food should be something to look forward
              to. Our menus are crafted by award-winning chefs, featuring both
              international favorites and local specialties from our destination
              countries.
            </p>
            <p>
              All meals are prepared using fresh, high-quality ingredients, with
              special dietary requirements accommodated with advance notice.
            </p>
          </div>
          <div className="experience-image">
            <img src={meal} alt="Inflight dining" />
          </div>
        </div>
      </section>

      <section className="about-section about-contact">
        <h2>Get to Know Us Better</h2>
        <p>Have questions about our company or want to learn more?</p>
        <div className="about-contact-buttons">
          <a href="/contact" className="about-contact-button">
            Contact Us
          </a>
          <a href="/faq" className="about-contact-button secondary">
            View FAQs
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
