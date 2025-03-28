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

const HeaderHomepage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Slide data - you can add more slides with different images/content
  const slides = [
    {
      image: HomepageAirplaneImage,
      title: "Fly With Confidence",
      subtitle: "Experience unparalleled comfort and exceptional service",
      cta: "Book Your Journey",
    },
    {
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Discover New Horizons",
      subtitle: "Over 200 destinations worldwide waiting for you",
      cta: "Explore Destinations",
    },
    {
      image:
        "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Premium Travel Experience",
      subtitle: "First-class amenities for all our passengers",
      cta: "View Amenities",
    },
  ];

  // Effect for slide autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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
                  <button className="secondary-cta">Learn More</button>
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
