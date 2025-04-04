import React from "react";
import Boeing_787 from "../../../assets/boeing-787.jpg";
import Airbus_A350 from "../../../assets/airbus-a350.jpg";
import Boeing_737_MAX from "../../../assets/boeing-737-max.jpg";
import Airbus_A320neo from "../../../assets/airbus-a320neo.jpg";
import {
  FaPlane,
  FaChevronRight,
} from "react-icons/fa";

const FleetPage = () => {
  const fleet = [
    {
      name: "Boeing 787 Dreamliner",
      image: Boeing_787,
      description:
        "The Boeing 787 Dreamliner is a long-haul, mid-size wide-body, twin-engine jet airliner known for its fuel efficiency and passenger comfort.",
    },
    {
      name: "Airbus A350",
      image: Airbus_A350,
      description:
        "The Airbus A350 is a state-of-the-art aircraft offering exceptional range, fuel efficiency, and advanced passenger amenities.",
    },
    {
      name: "Boeing 737 MAX",
      image: Boeing_737_MAX,
      description:
        "The Boeing 737 MAX is a narrow-body aircraft designed for short to medium-haul routes, featuring advanced aerodynamics and fuel efficiency.",
    },
    {
      name: "Airbus A320neo",
      image: Airbus_A320neo,
      description:
        "The Airbus A320neo is a popular choice for short-haul flights, offering reduced emissions and enhanced passenger comfort.",
    },
  ];

  return (
    <div className="font-segoe-ui text-[#343a40] overflow-x-hidden">
      <div className="relative h-[70vh] bg-plane-bg  bg-cover bg-top flex items-center justify-center text-center text-[white] lg:h-[60vh] sm:h-[50vh]">
        <div className="absolute top-[0] left-[0] w-full h-full bg-[rgba(0,_0,_0,_0.5)]"></div>
        <div className="relative max-w-[800px] px-8 py-[0] animate-[fadeInUp_1s_ease-out_forwards]">
          <h1 className="text-[3rem] mb-4 font-bold [text-shadow:2px_2px_4px_rgba(0,_0,_0,_0.5)] lg:text-[2.5rem] sm:text-[2rem]">
            Our Fleet
          </h1>
          <p className="text-[1.5rem] mb-8 [text-shadow:1px_1px_3px_rgba(0,_0,_0,_0.5)] lg:text-[1.3rem] sm:text-[1.1rem]">
            Discover the modern and efficient aircraft that make up our fleet,
            ensuring a safe and comfortable journey for every passenger.
          </p>
        </div>
      </div>
      <div className="max-w-[1200px] mt-12 mx-auto mb-20 p-8 md:p-6">
        <div className="text-[2rem] mb-6 flex items-center gap-2 text-primary-color m-8">
          <FaPlane className="text-[2.5rem]" />
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="cursor-pointer hover:underline hover:text-primary-light">
            <a href="\home">Home</a>
          </span>
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="text-primary-light font-semibold hover:underline">
            Our Fleet
          </span>
        </div>

        <div className="space-y-12 bg-white rounded-[15px] shadow-lg p-6 h-min text-center hover:shadow-xl transition-shadow ">
          {fleet.map((plane, index) => (
            <div
              key={index}
              className={`flex items-center gap-8 even:flex-row-reverse duration-300 group`}
            >
              {/* Image Section */}
              <div className="flex-[70%] flex justify-center">
                <img
                  src={plane.image}
                  alt={plane.name}
                  className="w-full h-[80%] rounded-[20px] shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text Section */}
              <div className="flex-[30%] flex flex-col justify-center text-left transition-transform duration-300 group-hover:translate-x-2">
                <h3 className="text-[1.9rem] text-primary-color mb-4 group-hover:text-primary-light transition-colors duration-300">
                  {plane.name}
                </h3>
                <p className="text-[#6c757d] leading-[1.6] text-[1.1rem] group-hover:text-[#343a40] transition-colors duration-300">
                  {plane.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetPage;