import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-[white] rounded-[12px] overflow-hidden [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] [transition:all_0.4s_cubic-bezier(0.175,_0.885,_0.32,_1.275)] animate-[fadeInUp_0.8s_ease-out_forwards] border-[1px]border-[rgba(0,0,0,0.05)] hover:-translate-y-[5px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] group`}>
      <div className={`px-8 py-6 flex justify-between items-center cursor-pointer [transition:all_0.3s_ease] bg-[white] border-b-[1px_solid_transparent] group:bg-[#f8f9fa] group:border-b-[1px_solid_rgba(0,_0,_0,_0.05)] md:px-6 md:py-5 ${isOpen ? "bg-[#f8f9fa] border-b-[1px_solid_rgba(0,_0,_0,_0.05)]" : ""}`} onClick={toggleOpen}>
        <h3 className="m-0 text-[1.1rem] text-[#343a40] font-semibold [transition:color_0.3s_ease] group-hover:text-primary-color">{question}</h3>
        <div className={`text-[#6c757d] text-[1.2rem] [transition:all_0.3s_ease] ${isOpen ? "rotate-180 text-primary-color" : ""}`}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      <div className={`max-h-[0] overflow-hidden [transition:max-height_0.5s_ease,_padding_0.5s_ease] bg-[white] opacity-0 ${isOpen ? "max-h-[500px] px-8 py-6 opacity-100 md:px-6 md:py-5" : ""}`}>
        <p className="m-0 text-[#6c757d] leading-[1.6] text-[1rem]">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;
