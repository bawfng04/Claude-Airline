import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { API_URL, GET_TESTIMONIALS_API } from "../../../api/apis";

const initTestimonials = [
  {
    id: 1,
    user_name: "Sarah Johnson",
    user_location: "London, UK",
    user_testimonial:
      "The flight experience with Claude Airlines was exceptional. The crew was attentive, the seats were comfortable, and the food was delicious!",
    user_stars: 5,
    fullImagePath: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    user_name: "Michael Chen",
    user_location: "Singapore",
    user_testimonial:
      "I've flown with many airlines, but Claude Airlines stands out for their punctuality and service quality. Will definitely fly with them again!",
    user_stars: 5,
    fullImagePath: "https://randomuser.me/api/portraits/men/74.jpg",
  },
  {
    id: 3,
    user_name: "Emily Rodriguez",
    user_location: "Barcelona, Spain",
    user_testimonial:
      "The in-flight entertainment was top-notch and made my 12-hour flight feel much shorter. Great selection of movies and comfortable seats.",
    user_stars: 4,
    fullImagePath: "https://randomuser.me/api/portraits/women/58.jpg",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fetchedTestimonials, setFetchedTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    const response = await fetch(GET_TESTIMONIALS_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const processedData = data.data;
    console.log("testimonials:", processedData);
    if (processedData && processedData.length > 0) {
      console.log("abcdef", processedData);
      // console.log("yes");
      const updatedData = processedData.map((d) => ({
        ...d,
        fullImagePath: d.user_image ? `${API_URL}/${d.user_image}` : null,
      }))
      console.log("updatedData: ", updatedData);
      setFetchedTestimonials(updatedData);
    }
    else {
      console.log("No data found");
      setFetchedTestimonials(initTestimonials);
    }
    // console.log("this shit: ", processedData);
  }


  useEffect(() => {
    fetchTestimonials();
  }, [])

  useEffect(() => {
    if (fetchedTestimonials.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % fetchedTestimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchedTestimonials.length]);

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">What Our Passengers Say</h2>
      <div className="testimonials-slider">
        {fetchedTestimonials.map((testimonial, index) => (
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
        {fetchedTestimonials.map((testimonial, index) => (
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
              <p className="testimonial-text">{testimonial.user_testimonial}</p>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < testimonial.user_stars ? "star-filled" : "star-empty"
                    }
                  />
                ))}
              </div>
            </div>
            <div className="testimonial-author">
              <img
                src={testimonial.fullImagePath}
                alt={testimonial.user_name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4 className="testimonial-name">{testimonial.user_name}</h4>
                <p className="testimonial-location">{testimonial.user_location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-dots">
        {fetchedTestimonials.map((_, index) => (
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
