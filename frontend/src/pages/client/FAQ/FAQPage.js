import React from "react";
import "./FAQPage.css";
import FAQItem from "./FAQItem";
import { FaQuestionCircle } from "react-icons/fa";

const FAQPage = () => {
  const faqItems = [
    {
      question: "How do I book a flight?",
      answer:
        "To book a flight, navigate to our homepage and use the booking form. Enter your departure and arrival destinations, select your travel dates, and click 'Search Flights'. You'll then be presented with available options where you can select your preferred flight and complete the booking process by entering passenger details and payment information.",
    },
    {
      question: "What is your baggage allowance policy?",
      answer:
        "Our standard baggage allowance includes one carry-on bag (max. 7kg) and one checked bag (max. 23kg) per passenger. Premium and business class passengers are entitled to additional baggage allowance. Excess baggage can be purchased during booking or at check-in. Please note that specific routes may have different restrictions, so we recommend checking your flight details.",
    },
    {
      question: "Can I change or cancel my reservation?",
      answer:
        "Yes, changes and cancellations can be made through your account on our website or by contacting our customer service. Changes made at least 24 hours before departure typically incur a change fee plus any fare difference. Cancellation policies vary based on the fare type you purchased - flexible fares offer more generous cancellation terms compared to promotional fares.",
    },
    {
      question: "How do I join your frequent flyer program?",
      answer:
        "Joining our frequent flyer program is easy and free. Simply click on the 'Join Now' button on our website and complete the registration form. Once registered, you'll receive a membership number that you can use when booking flights to earn miles. These miles can be redeemed for free flights, upgrades, and various other rewards with our partner airlines and businesses.",
    },
    {
      question:
        "Do you provide special assistance for passengers with disabilities?",
      answer:
        "Yes, we offer special assistance services for passengers with disabilities or reduced mobility. These services include wheelchair assistance, priority boarding, and special seating arrangements. To ensure a smooth travel experience, please inform us of any requirements at least 48 hours before your flight by contacting our customer service team or including this information during the booking process.",
    },
    {
      question: "What COVID-19 measures are currently in place?",
      answer:
        "We continue to maintain enhanced hygiene protocols on all our flights. These include regular disinfection of high-touch surfaces, HEPA air filters on aircraft, and modified meal services where appropriate. Requirements for testing, vaccination, or mask-wearing vary by destination and are regularly updated in line with local regulations. Please check the latest requirements for your specific route before traveling.",
    },
    {
      question: "How early should I arrive at the airport?",
      answer:
        "We recommend arriving at the airport at least 2 hours before domestic flights and 3 hours before international flights. This allows adequate time for check-in, security screening, immigration procedures (for international flights), and boarding. During peak travel seasons or at busy airports, you may want to allow additional time to avoid any stress from unexpected delays.",
    },
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <div className="faq-icon-large">
          <FaQuestionCircle />
        </div>
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Find answers to the most common questions about our services
        </p>
      </div>

      <div className="faq-search">
        <input
          type="text"
          placeholder="Search for questions..."
          className="faq-search-input"
        />
        <button className="faq-search-button">Search</button>
      </div>

      <div className="faq-categories">
        <button className="faq-category active">All</button>
        <button className="faq-category">Booking</button>
        <button className="faq-category">Baggage</button>
        <button className="faq-category">Check-in</button>
        <button className="faq-category">Special Assistance</button>
      </div>

      <div className="faq-list">
        {faqItems.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>

      <div className="faq-contact-section">
        <h2>Still have questions?</h2>
        <p>
          Our customer service team is here to help you with any other questions
          you might have.
        </p>
        <div className="faq-contact-buttons">
          <a href="/contact" className="faq-contact-button">
            Contact Us
          </a>
          <a href="tel:+8490123456" className="faq-contact-button secondary">
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
