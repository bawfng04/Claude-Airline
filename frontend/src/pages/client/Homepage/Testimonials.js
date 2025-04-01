import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "London, UK",
    text: "The flight experience with Claude Airlines was exceptional. The crew was attentive, the seats were comfortable, and the food was delicious!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    text: "I've flown with many airlines, but Claude Airlines stands out for their punctuality and service quality. Will definitely fly with them again!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/74.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Barcelona, Spain",
    text: "The in-flight entertainment was top-notch and made my 12-hour flight feel much shorter. Great selection of movies and comfortable seats.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/58.jpg",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">What Our Passengers Say</h2>
      <div className="testimonials-slider">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-card ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div className="testimonial-quote">
              <FaQuoteLeft className="quote-icon" />
            </div>
            <div className="testimonial-content">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < testimonial.rating ? "star-filled" : "star-empty"
                    }
                  />
                ))}
              </div>
            </div>
            <div className="testimonial-author">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <p className="testimonial-location">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`testimonial-dot ${
              index === activeIndex ? "active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
