import React from "react";
import FAQItem from "./FAQItem";
import { FaQuestionCircle, FaChevronRight } from "react-icons/fa";

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
    <div className="max-w-[1200px] mt-12 mx-[auto] mb-20 p-8 font-['Segoe_UI',_Arial,_sans-serif] md:p-6 md:mx-[auto] md:my-8">
      <div className="text-center mb-12 animate-[fadeInDown_0.8s_ease-out_forwards]">
        <div className="text-[2rem] mb-6 mt-4 flex items-center gap-2 text-primary-color">
          <FaQuestionCircle className="text-[2.5rem]" />
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="cursor-pointer hover:underline hover:text-primary-light"><a href="\home">Home</a></span>
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="text-primary-light font-semibold hover:underline">Contact Us</span>
        </div>
        <h1 className="text-[2.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[100px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color hover:after:w-[180px] md:text-[2.2rem]"> 
          Frequently Asked Questions
        </h1>
        <p className="text-[#6c757d] text-[1.2rem] max-w-[700px] mt-6 mx-[auto] mb-[0]">
          Find answers to the most common questions about our services
        </p>
      </div>

      <div className="flex justify-center mt-8 mx-[0] mb-12 animate-[fadeInUp_0.8s_ease-out_forwards]">
        <input
          type="text"
          placeholder="Search for questions..."
          className="w-[70%] px-6 py-3.5 text-[1rem] border-[2px] border-[solid] border-color rounded-tl-[8px] rounded-bl-[8px] [transition:all_0.3s_ease] focus:outline-[none] focus:[box-shadow:0_0_0_3px_rgba(139,_0,_0,_0.1)] focus:border-primary-color md:w-[65%]"
        />
        <button className="px-6 py-3.5 text-[white] border-[none] rounded-tr-[8px] rounded-br-[8px] cursor-pointer [transition:all_0.3s_ease] font-semibold bg-primary-color hover:bg-primary-light hover:-translate-y-[2px]">
          Search
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.2s] md:gap-2">
        <button className="px-6 py-3 border-[2px] border-[solid] rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium text-[white] -translate-y-[3px] [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] bg-primary-color border-primary-color md:px-4 md:py-2 md:text-[0.9rem]">All</button>
        <button className="px-6 py-3 bg-[#f8f9fa] border-[2px] border-[solid] border-color rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium hover:text-[white] hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:border-primary-color md:px-4 md:py-2 md:text-[0.9rem]">Booking</button>
        <button className="px-6 py-3 bg-[#f8f9fa] border-[2px] border-[solid] border-color rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium hover:text-[white] hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:border-primary-color md:px-4 md:py-2 md:text-[0.9rem]">Baggage</button>
        <button className="px-6 py-3 bg-[#f8f9fa] border-[2px] border-[solid] border-color rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium hover:text-[white] hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:border-primary-color md:px-4 md:py-2 md:text-[0.9rem]">Check-in</button>
        <button className="px-6 py-3 bg-[#f8f9fa] border-[2px] border-[solid] border-color rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium hover:text-[white] hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:border-primary-color md:px-4 md:py-2 md:text-[0.9rem]">Special Assistance</button>
      </div>

      <div className="flex flex-col gap-6 mb-16">
      {faqItems.map((item, index) => (
          <FAQItem 
            key={index} 
            question={item.question} 
            answer={item.answer}
            style={{ animationDelay: `${index * 0.1}s` }} 
          />
        ))}
      </div>

      <div className="bg-[linear-gradient(135deg,_#f8f9fa_0%,_#ffffff_100%)] p-12 text-center rounded-[15px] [box-shadow:0_10px_30px_rgba(0,_0,_0,_0.05)] mt-16 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.7s] md:p-8">
        <h2 className="mb-4 text-[1.8rem] text-primary-color">Still have questions?</h2>
        <p className="text-[#6c757d] mb-8 max-w-[600px] ml-auto mr-auto">
          Our customer service team is here to help you with any other questions
          you might have.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="/contact" className="px-8 py-3.5 text-[white] no-underline rounded-[8px] [transition:all_0.3s_ease] font-semibold inline-block bg-primary-color hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-light">
            Contact Us
          </a>
          <a href="tel:+8490123456" className="px-8 py-3.5 no-underline rounded-[8px] [transition:all_0.3s_ease] font-semibold inline-block bg-[white] border-[2px] border-[solid] border-primary-color text-primary-color hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:text-[white]">
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
