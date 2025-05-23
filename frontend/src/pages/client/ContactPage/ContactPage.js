import React, { useState, useEffect } from "react";
import "./ContactPage.css";
import ContactUnit from "./ContactUnit";
import ContactForm from "./ContactForm";
import phone from "../../../assets/phone.png";
import email from "../../../assets/email.png";
import location from "../../../assets/location.png";
import faq from "../../../assets/faq.png";
import {  FaUsers } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaChevronRight,
} from "react-icons/fa";
import { GET_CONTACT_LOCATIONS_API } from "../../../api/apis";
import LocationMap from "./LocationMap";
import { Helmet } from "react-helmet";



const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactLocations, setContactLocations] = useState([]);

  const fetchContactLocations = async () => {
    try {
      const response = await fetch(GET_CONTACT_LOCATIONS_API,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contact locations");
      }
      const data = await response.json();
      // console.log("Contact-location-data:", data);
      if (data && data.data && Array.isArray(data.data)) {
        setContactLocations(data.data);
        console.log("contact locations:", data.data)
      }
      else{
        setContactLocations([]);
        console.error("No contact locations found in the response.");
      }
    }
    catch (error) {
      console.error("Error fetching contact locations:", error);
    }
  }

  useEffect(() => {
    fetchContactLocations();
  }, []);



  const handleFormSubmit = () => {
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (

    <div>
            <Helmet>
              <title>Claude Airlines - Contact Us</title>
              <meta
                name="description"
                content="Contact Claude Airlines for any inquiries, support, or feedback. We're here to assist you."
              />
              <meta
                name="keywords"
                content="contact, support, customer service, inquiries, feedback"
              />
              <link rel="canonical" href="https://claude-airplanes.web.app/contact" />
            </Helmet>
      <div className="dem"></div>

      <div className="contact-page-wrapper">
        <div className="contact-hero">
          <div className="contact-hero-overlay"></div>
          <div className="contact-hero-content">
            <h1>Get In Touch</h1>
            <p>We're here to help and answer any questions you might have</p>
          </div>
        </div>
        <div className="contact-us-container">
          <div className="contact-section">
            <div className="text-[1.5rem] mb-6 flex items-center gap-2 text-primary-color fade-in-up">
              <FaUsers className="text-[2.5rem]" />
              <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
              <span className="cursor-pointer hover:underline hover:text-primary-light">
                <a href="\home">Home</a>
              </span>
              <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
              <span className="text-primary-light font-semibold hover:underline">
                Contact Us
              </span>
            </div>
            <h2 className="contact-us-title">Contact Us</h2>
            <p className="contact-us-subtitle">
              Our team is eager to assist you. Choose the method that works best
              for you.
            </p>

            <div className="contact-units-wrapper">
              <ContactUnit
                img={phone}
                title="Call Us"
                description="For immediate assistance, call our 24/7 customer service line."
                btntext="+ 1 (800) 123-4567"
                btnLink="tel:+18001234567"
              />
              <ContactUnit
                img={email}
                title="Email Us"
                description="For general inquiries, send us an email and we'll respond within 24 hours."
                btntext="support@airline.com"
                btnLink="mailto:support@airline.com"
              />
              <ContactUnit
                img={location}
                title="Visit Us"
                description="Stop by our main office during business hours for in-person assistance."
                btntext="Find Locations"
                btnLink="#locations"
              />
              <ContactUnit
                img={faq}
                title="FAQ"
                description="Find answers to commonly asked questions about our services."
                btntext="View FAQs"
                btnLink="/faq"
              />
            </div>
          </div>

          <div className="contact-divider">
            <span>OR</span>
          </div>

          <div className="contact-form-section" id="contact-form">
            <div className="contact-form-container">
              <div className="contact-form-text">
                <h2>Send Us a Message</h2>
                <p>
                  Have a specific question or need detailed assistance? Fill out
                  the form below and we'll get back to you as soon as possible.
                </p>
                <div className="contact-form-info">
                  <div className="contact-info-item">
                    <FaMapMarkerAlt className="contact-info-icon" />
                    <div>
                      <h3>Main Office</h3>
                      <p>123 Aviation Blvd, Los Angeles, CA 90045</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <FaClock className="contact-info-icon" />
                    <div>
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 8am - 8pm</p>
                      <p>Saturday: 9am - 5pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                <div className="contact-social">
                  <h3>Connect With Us</h3>
                  <div className="social-icons">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-form-wrapper">
                {formSubmitted ? (
                  <div className="form-success-message">
                    <div className="success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>
                      Your message has been sent successfully. We'll get back to
                      you shortly.
                    </p>
                  </div>
                ) : (
                  <ContactForm onFormSubmit={handleFormSubmit} />
                )}
              </div>
            </div>
          </div>

          <div className="contact-locations-section" id="locations">
            <h2>Our Locations</h2>
            <p className="locations-subtitle">
              Visit one of our offices or ticket counters for in-person
              assistance
            </p>

            <div className="locations-grid">
              {contactLocations.map((location) => (
                <div className="location-card" key={location.id}>
                  <div className="location-header">
                    <h3>{location.location_name}</h3>
                    <span className="location-badge">{location.des_type}</span>
                  </div>
                  <div className="location-details">
                    <p>
                      <strong>Address:</strong> {location.address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {location.phone_number}
                    </p>
                    <p>
                      <strong>Email:</strong> {location.email}
                    </p>
                    <p>
                      <strong>Hours:</strong> {location.working_hours}
                    </p>
                  </div>
                  <LocationMap
                    embedCode={location.location_embed_code}
                    locationName={
                      location.location_name + location.address_string
                    }
                  />
                </div>
              ))}

              {
                contactLocations.length === 0 && (
                  <>
                <div className="location-card">
                <div className="location-header">
                  <h3>Headquarters</h3>
                  <span className="location-badge">Main Office</span>
                </div>
                <div className="location-details">
                  <p>
                    <strong>Address:</strong> 123 Aviation Blvd, Los Angeles, CA
                    90045
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (800) 123-4567
                  </p>
                  <p>
                    <strong>Hours:</strong> Monday-Friday: 8am-8pm
                  </p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  Get Directions
                </a>
              </div>

              <div className="location-card">
                <div className="location-header">
                  <h3>New York Office</h3>
                  <span className="location-badge">Regional Office</span>
                </div>
                <div className="location-details">
                  <p>
                    <strong>Address:</strong> 456 Park Avenue, New York, NY
                    10022
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (877) 456-7890
                  </p>
                  <p>
                    <strong>Hours:</strong> Monday-Friday: 9am-6pm
                  </p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  Get Directions
                </a>
              </div>

              <div className="location-card">
                <div className="location-header">
                  <h3>Chicago Office</h3>
                  <span className="location-badge">Regional Office</span>
                </div>
                <div className="location-details">
                  <p>
                    <strong>Address:</strong> 789 Michigan Ave, Chicago, IL
                    60611
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (888) 987-6543
                  </p>
                  <p>
                    <strong>Hours:</strong> Monday-Friday: 9am-6pm
                  </p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  Get Directions
                </a>
                    </div>
                    </>
                )
              }


            </div>
          </div>

          <div className="contact-map-section">
            <h2>Find Us on the Map</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.2098247651584!2d-118.40776702422818!3d33.94525597322335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b6b376c66c8f%3A0x4896b7d0c9de61e8!2sLos%20Angeles%20International%20Airport!5e0!3m2!1sen!2sus!4v1690576874386!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              ></iframe>
            </div>
          </div>

          <div className="contact-cta-section">
            <h2>Need Immediate Assistance?</h2>
            <p>
              Our customer service team is ready to help you with any questions
              or concerns you may have.
            </p>
            <div className="cta-buttons">
              <a href="tel:+18001234567" className="cta-button primary">
                Call Now
              </a>
              <a href="#contact-form" className="cta-button secondary">
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
