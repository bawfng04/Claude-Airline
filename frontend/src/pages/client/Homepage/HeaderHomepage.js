import React, { useState, useEffect } from "react";
import "./Homepage.css";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import HomepageAirplaneImage from "../../../assets/homepage-airplane-image.png";
import HomepageAirplaneImage2 from "../../../assets/homepage-airplane-image2.png";
import HomepageAirplaneImage3 from "../../../assets/homepage-airplane-image3.png";
import HomepageAirplaneImage4 from "../../../assets/homepage-airplane-image4.png";

const HeaderHomepage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false); // eslint-disable-next-line
  const [hidden, setHidden] = useState(false);
  // Slide data - you can add more slides with different images/content
  const slides = [
    {
      image: HomepageAirplaneImage4,
      title: "Welcome to Claude Airplanes",
      subtitle: "Your journey starts here",
      cta: "Book Now",
    },
    {
      image: HomepageAirplaneImage,
      title: "Fly With Confidence",
      subtitle: "Experience unparalleled comfort and exceptional service",
      cta: "Book Your Journey",
    },
    {
      image: HomepageAirplaneImage2,
      title: "Discover New Horizons",
      subtitle: "Over 200 destinations worldwide waiting for you",
      cta: "Explore Destinations",
    },
    {
      image: HomepageAirplaneImage3,
      title: "Premium Travel Experience",
      subtitle: "First-class amenities for all our passengers",
      cta: "View Amenities",
    },
  ];

  // Effect for slide autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Effect for scroll detection
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrolled(currentScrollY > 50);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to navigate to booking section
  const scrollToBooking = () => {
    const bookingSection = document.querySelector(".booking-form");
    bookingSection.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header className={`homepage-header ${scrolled ? "scrolled" : ""}`}>
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === activeSlide ? "active" : ""}`}
            style={{
              backgroundImage: `url(${
                index === 0 ? slide.image : slide.image
              })`,
            }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <div className="slide-text">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="hero-cta">
                  <button className="primary-cta" onClick={scrollToBooking}>
                    {slide.cta} <FaArrowRight className="cta-icon" />
                  </button>
                  <button className="secondary-cta">
                    <a href="/about">Learn More</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider navigation */}
        <div className="slider-nav">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Quick search overlay */}
      <div className="quick-search">
        <div className="search-container">
          <h2>Find Your Flight</h2>
          <div className="search-form">
            <div className="form-group">
              <FaMapMarkerAlt className="input-icon" />
              <input type="text" placeholder="From" />
            </div>
            <div className="form-group">
              <FaMapMarkerAlt className="input-icon" />
              <input type="text" placeholder="To" />
            </div>
            <div className="form-group">
              <FaCalendarAlt className="input-icon" />
              <input type="date" placeholder="Departure" />
            </div>
            <div className="form-group">
              <FaCalendarAlt className="input-icon" />
              <input type="date" placeholder="Return" />
            </div>
            <button className="search-button">
              <FaSearch className="search-icon" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-indicator"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <span>Explore</span>
        <FaChevronDown className="scroll-icon" />
      </div>
    </header>
  );
};

export default HeaderHomepage;
