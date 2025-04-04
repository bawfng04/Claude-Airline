import React from "react";
import {
  FaMedal,
  FaUsers,
  FaCheckCircle,
  FaHistory,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import airplaneLogo from "../../../assets/airplaneLogo.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";
import plane from "../../../assets/plane.jpg";

const AboutUs = () => {
  return (
    <div className="font-segoe-ui text-[#343a40] overflow-x-hidden">
      <div className="relative h-[70vh] bg-homepage-airplane bg-cover bg-center flex items-center justify-center text-center text-[white] lg:h-[60vh] sm:h-[50vh]">
        <div className="absolute top-[0] left-[0] w-full h-full bg-[rgba(0,_0,_0,_0.5)]"></div>
        <div className="relative max-w-[800px] px-8 py-[0] animate-[fadeInUp_1s_ease-out_forwards]">
          <h1 className="text-[3rem] mb-4 font-bold [text-shadow:2px_2px_4px_rgba(0,_0,_0,_0.5)] lg:text-[2.5rem] sm:text-[2rem]">
            About Our Airline
          </h1>
          <p className="text-[1.5rem] mb-8 [text-shadow:1px_1px_3px_rgba(0,_0,_0,_0.5)] lg:text-[1.3rem] sm:text-[1.1rem]">
            We've been connecting people and places for over 25 years
          </p>
        </div>
      </div>

      <div>
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
          <div className="text-center max-w-[800px] mx-[auto] my-[0] animate-[fadeInUp_0.8s_ease-out_forwards]">
            <div className="text-[1.5rem] mb-6 flex items-center gap-2 text-primary-color">
              <FaUsers className="text-[2.5rem]" />
              <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
              <span className="cursor-pointer hover:underline hover:text-primary-light">
                <a href="\home">Home</a>
              </span>
              <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
              <span className="text-primary-light font-semibold hover:underline">
                About Us
              </span>
            </div>
            <h2 className="text-[2.5rem] text-primary-color mb-6 relative inline-block after:contents-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color md:text-[2rem]">
              Our Story
            </h2>
            <p className="text-[1.1rem] leading-[1.7] text-[#555] mb-6">
              Founded in 1998, our airline began with a small fleet of just 3
              aircraft serving domestic routes. Today, we've grown to become one
              of Southeast Asia's leading carriers, connecting passengers to
              over 100 destinations worldwide with a modern fleet of 78
              aircraft.
            </p>
            <p className="text-[1.1rem] leading-[1.7] text-[#555] mb-6">
              Throughout our journey, we've remained committed to our founding
              vision: making air travel accessible, comfortable, and enjoyable
              for everyone while upholding the highest standards of safety and
              service.
            </p>
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color bg-[linear-gradient(135deg,_#f8f9fa_0%,_#ffffff_100%)] md:px-6 md:py-12">
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="flex-[1] min-w-[300px] animate-[fadeInUp_0.8s_ease-out_forwards]">
              <div className="bg-[white] p-10 rounded-[15px] [box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] h-full [transition:all_0.3s_ease] relative overflow-hidden before:content-[''] before:absolute before:top-[0] before:left-[0] before:w-full before:h-full before:bg-[linear-gradient(_to_bottom,_rgba(139,_0,_0,_0)_0%,_rgba(139,_0,_0,_0.1)_100%_)] before:opacity-0 before:[transition:opacity_0.4s_ease] before:pointer-events-none hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.15)] hover:before:opacity-100">
                <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color hover:after:w-full md:p-6">
                  Our Mission
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-[#555]">
                  To connect people and places with safe, reliable air travel
                  that is accessible to all, while delivering exceptional
                  service that exceeds expectations at every step of the
                  journey.
                </p>
              </div>
            </div>
            <div className="flex-[1] min-w-[300px] animate-[fadeInUp_0.8s_ease-out_forwards]">
              <div className="bg-[white] p-10 rounded-[15px] [box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] h-full [transition:all_0.3s_ease] relative overflow-hidden before:content-[''] before:absolute before:top-[0] before:left-[0] before:w-full before:h-full before:bg-[linear-gradient(_to_bottom,_rgba(139,_0,_0,_0)_0%,_rgba(139,_0,_0,_0.1)_100%_)] before:opacity-0 before:[transition:opacity_0.4s_ease] before:pointer-events-none hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.15)] hover:before:opacity-100">
                <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-zcolor after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color hover:after:w-full md:p-6">
                  Our Vision
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-[#555]">
                  To be recognized globally as the airline of choice, known for
                  innovation, sustainability, and a customer experience that
                  sets the industry standard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color about-values md:px-6 md:py-12">
          <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Core Values
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-8">
            <div className="bg-[white] p-8 rounded-[15px] [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] sm:p-6">
              <div className="text-[2.5rem] mb-4 text-primary-color sm:text-[2rem]">
                <FaUsers />
              </div>
              <h3 className="text-[#343a40] text-[1.3rem] mb-4">
                Customer Focus
              </h3>
              <p className="text-[#555] leading-[1.6]">
                We put our passengers at the heart of everything we do, creating
                experiences tailored to their needs.
              </p>
            </div>
            <div className="bg-[white] p-8 rounded-[15px] [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [animation-delay:0.2s] sm:p-6">
              <div className="text-[2.5rem] mb-4 text-primary-color sm:text-[2rem]">
                <FaCheckCircle />
              </div>
              <h3 className="text-[#343a40] text-[1.3rem] mb-4">
                Safety First
              </h3>
              <p className="text-[#555] leading-[1.6]">
                Safety is non-negotiable, and we maintain the highest standards
                in all our operations.
              </p>
            </div>
            <div className="bg-[white] p-8 rounded-[15px] [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [animation-delay:0.4s] sm:p-6">
              <div className="text-[2.5rem] mb-4 text-primary-color sm:text-[2rem]">
                <FaMedal />
              </div>
              <h3 className="text-[#343a40] text-[1.3rem] mb-4">Excellence</h3>
              <p className="text-[#555] leading-[1.6]">
                We strive for excellence in every aspect of our service,
                continuously improving to exceed expectations.
              </p>
            </div>
            <div className="bg-[white] p-8 rounded-[15px] [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [animation-delay:0.6s] sm:p-6">
              <div className="text-[2.5rem] mb-4 text-primary-color sm:text-[2rem]">
                <FaHistory />
              </div>
              <h3 className="text-[#343a40] text-[1.3rem] mb-4">Reliability</h3>
              <p className="text-[#555] leading-[1.6]">
                We keep our promises to passengers, with punctuality and
                dependability in all our operations.
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color about-leadership md:px-6 md:py-12">
          <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-8 sm:grid-cols-[1fr]">
            <div className="bg-[white] rounded-[15px] overflow-hidden [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] hover:scale-110">
              <div className="w-[120px] h-[120px] rounded-[50%] overflow-hidden mt-8 mx-[auto] mb-4 border-[3px] border-[solid] border-primary-color [transition:all_0.3s_ease] scale-110">
                <img
                  src={airplaneLogo}
                  alt="CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[#343a40] text-[1.5rem] mb-2">John Smith</h3>
              <p className="font-semibold mb-4 text-primary-color">
                Chief Executive Officer
              </p>
              <p className="text-[#555] pt-[0] px-6 pb-8 leading-[1.6]">
                With 20+ years in aviation, John has transformed our airline
                into a global carrier known for excellence and innovation.
              </p>
            </div>
            <div className="bg-[white] rounded-[15px] overflow-hidden [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.2s] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] hover:scale-110">
              <div className="w-[120px] h-[120px] rounded-[50%] overflow-hidden mt-8 mx-[auto] mb-4 border-[3px] border-[solid] border-primary-color [transition:all_0.3s_ease] scale-110">
                <img
                  src={airplaneLogo}
                  alt="COO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[#343a40] text-[1.5rem] mb-2">
                Sarah Johnson
              </h3>
              <p className="font-semibold mb-4 text-primary-color">
                Chief Operations Officer
              </p>
              <p className="text-[#555] pt-[0] px-6 pb-8 leading-[1.6]">
                Sarah oversees our daily operations, ensuring we maintain the
                highest standards of service and efficiency.
              </p>
            </div>
            <div className="bg-[white] rounded-[15px] overflow-hidden [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.4s] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] hover:scale-110">
              <div className="w-[120px] h-[120px] rounded-[50%] overflow-hidden mt-8 mx-[auto] mb-4 border-[3px] border-[solid] border-primary-color [transition:all_0.3s_ease] scale-110">
                <img
                  src={airplaneLogo}
                  alt="CXO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[#343a40] text-[1.5rem] mb-2">
                Michael Chen
              </h3>
              <p className="font-semibold mb-4 text-primary-color">
                Chief Experience Officer
              </p>
              <p className="text-[#555] pt-[0] px-6 pb-8 leading-[1.6]">
                Michael leads our customer experience initiatives, focusing on
                creating memorable journeys for all passengers.
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color about-achievements md:px-6 md:py-12">
          <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Achievements
          </h2>
          <div className="relative max-w-[800px] mx-[auto] my-[0] before:content-[''] before:absolute before:left-2/4 before:-translate-x-1/2 before:w-[4px] before:h-full before:opacity-30 before:bg-primary-color md:before:left-[30px]">
            <div className="flex mb-10 relative animate-[fadeInUp_0.8s_ease-out_forwards] even:flex-row-reverse [animation-delay:0.1s] md:!flex-row group">
              <div className="min-w-[120px] text-center text-[white] px-4 py-2 rounded-[30px] font-semibold mx-8 my-[0] self-start [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] [transition:all_0.3s_ease] bg-primary-color group-hover:scale-110 lg:mx-4 lg:my-[0]md:min-w-[80px] md:mr-6 md:ml-0">
                2023
              </div>
              <div className="bg-[white] p-6 rounded-[10px] [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] flex-[1] max-w-half-minus-3rem [transition:all_0.3s_ease] group-hover:-translate-y-[5px] group-hover:[box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] lg:half-minus-2rem md:full-minus-120px sm:p-4">
                <h3 className="mb-2 text-[1.2rem] text-primary-color">
                  Best Airline in Southeast Asia
                </h3>
                <p className="text-[#555] leading-[1.6]">
                  Awarded by Skytrax World Airline Awards for the third
                  consecutive year
                </p>
              </div>
            </div>
            <div className="flex mb-10 relative animate-[fadeInUp_0.8s_ease-out_forwards] even:flex-row-reverse [animation-delay:0.3s] md:!flex-row group">
              <div className="min-w-[120px] text-center text-[white] px-4 py-2 rounded-[30px] font-semibold mx-8 my-[0] self-start [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] [transition:all_0.3s_ease] bg-primary-color group-hover:scale-110 lg:mx-4 lg:my-[0]md:min-w-[80px] md:mr-6 md:ml-0">
                2022
              </div>
              <div className="bg-[white] p-6 rounded-[10px] [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] flex-[1] max-w-half-minus-3rem [transition:all_0.3s_ease] group-hover:-translate-y-[5px] group-hover:[box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] lg:half-minus-2rem md:full-minus-120px sm:p-4">
                <h3 className="mb-2 text-[1.2rem] text-primary-color">
                  Best Cabin Crew
                </h3>
                <p className="text-[#555] leading-[1.6]">
                  Recognized for exceptional service and professionalism
                </p>
              </div>
            </div>
            <div className="flex mb-10 relative animate-[fadeInUp_0.8s_ease-out_forwards] even:flex-row-reverse [animation-delay:0.5s] md:!flex-row group">
              <div className="min-w-[120px] text-center text-[white] px-4 py-2 rounded-[30px] font-semibold mx-8 my-[0] self-start [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] [transition:all_0.3s_ease] bg-primary-color group-hover:scale-110 lg:mx-4 lg:my-[0]md:min-w-[80px] md:mr-6 md:ml-0">
                2021
              </div>
              <div className="bg-[white] p-6 rounded-[10px] [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] flex-[1] max-w-half-minus-3rem [transition:all_0.3s_ease] group-hover:-translate-y-[5px] group-hover:[box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] lg:half-minus-2rem md:full-minus-120px sm:p-4">
                <h3 className="mb-2 text-[1.2rem] text-primary-color">
                  Most Sustainable Airline
                </h3>
                <p className="text-[#555] leading-[1.6]">
                  For our commitment to reducing carbon emissions and
                  environmental impact
                </p>
              </div>
            </div>
            <div className="flex mb-10 relative animate-[fadeInUp_0.8s_ease-out_forwards] even:flex-row-reverse [animation-delay:0.7s] md:!flex-row group">
              <div className="min-w-[120px] text-center text-[white] px-4 py-2 rounded-[30px] font-semibold mx-8 my-[0] self-start z-10 [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] [transition:all_0.3s_ease] bg-primary-color group-hover:scale-110 lg:mx-4 lg:my-[0]md:min-w-[80px] md:mr-6 md:ml-0">
                2020
              </div>
              <div className="bg-[white] p-6 rounded-[10px] [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] flex-[1] max-w-half-minus-3rem [transition:all_0.3s_ease] group-hover:-translate-y-[5px] group-hover:[box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] lg:half-minus-2rem md:full-minus-120px sm:p-4">
                <h3 className="mb-2 text-[1.2rem] text-primary-color">
                  Best Inflight Entertainment
                </h3>
                <p className="text-[#555] leading-[1.6]">
                  For our innovative entertainment system and content selection
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color about-experience md:px-6 md:py-12">
          <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem] md:flex-col">
            The Airline Experience
          </h2>
          <div className="flex flex-wrap items-center gap-12 mb-16 animate-[fadeInUp_0.8s_ease-out_forwards] group">
            <div className="flex-[1] min-w-[300px] max-w-[500px] overflow-hidden rounded-[15px] [box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [transition:all_0.3s_ease] group-hover:-translate-y-[10px] group-hover:[box-shadow:0_20px_40px_rgba(0,_0,_0,_0.15)]">
              <img
                src={comfortable}
                alt="Comfortable seating"
                className="w-full h-auto block [transition:transform_0.5s_ease] group-hover:scale-105 md:w-full md:max-w-full"
              />
            </div>
            <div className="flex-[1] min-w-[300px]">
              <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color group-hover:after:w-full">
                Comfort Above All
              </h3>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                Our aircraft are equipped with ergonomically designed seats,
                providing optimal comfort even on long-haul flights. With
                generous legroom and adjustable headrests, you can relax and
                arrive at your destination feeling refreshed.
              </p>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                Premium cabins feature fully-flat beds and private suites for an
                unparalleled travel experience.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-12 mb-16 animate-[fadeInUp_0.8s_ease-out_forwards] flex-row-reverse [animation-delay:0.4s] md:flex-col group">
            <div className="flex-[1] min-w-[300px]">
              <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color group-hover:after:w-full">
                Culinary Excellence
              </h3>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                We believe that airline food should be something to look forward
                to. Our menus are crafted by award-winning chefs, featuring both
                international favorites and local specialties from our
                destination countries.
              </p>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                All meals are prepared using fresh, high-quality ingredients,
                with special dietary requirements accommodated with advance
                notice.
              </p>
            </div>
            <div className="flex-[1] min-w-[300px] max-w-[500px] overflow-hidden rounded-[15px] [box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [transition:all_0.3s_ease] group-hover:-translate-y-[10px] group-hover:[box-shadow:0_20px_40px_rgba(0,_0,_0,_0.15)]">
              <img
                src={meal}
                alt="Inflight dining"
                className="w-full h-auto block [transition:transform_0.5s_ease] group-hover:scale-105 md:w-full md:max-w-full"
              />
            </div>
          </div>
          <Link
            to="/planes"
            className="flex flex-wrap items-center gap-12 mb-16 animate-[fadeInUp_0.8s_ease-out_forwards] flex-row-reverse [animation-delay:0.8s] md:flex-col group"
          >
            <div className="flex-[1] min-w-[300px]">
              <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color group-hover:after:w-full">
                Our Fleet
              </h3>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                Our fleet consists of modern, fuel-efficient aircraft designed
                for comfort and sustainability. Each aircraft is equipped with
                the latest technology to ensure a smooth and enjoyable flight.
              </p>
              <p className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                We continuously invest in our fleet to enhance passenger comfort
                and reduce our environmental impact, with a commitment to
                sustainability at the core of our operations.
              </p>
            </div>
            <div className="flex-[1] min-w-[300px] max-w-[500px] overflow-hidden rounded-[15px] [box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [transition:all_0.3s_ease] group-hover:-translate-y-[10px] group-hover:[box-shadow:0_20px_40px_rgba(0,_0,_0,_0.15)]">
              <img
                src={plane}
                alt="Plane"
                className="w-full h-auto block [transition:transform_0.5s_ease] group-hover:scale-105 md:w-full md:max-w-full"
              />
            </div>
          </Link>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color text-center rounded-[15px] animate-[fadeInUp_0.8s_ease-out_forwards] md:px-6 md:py-12">
          <h2 className="text-[2.2rem] mb-4 text-primary-color">
            Get to Know Us Better
          </h2>
          <p className="text-[#555] text-[1.2rem] mb-8 max-w-[600px] ml-auto mr-auto">
            Have questions about our company or want to learn more?
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="/contact"
              className="px-10 py-4 text-[white] no-underline rounded-[8px] font-semibold text-[1.1rem] [transition:all_0.3s_ease] inline-block bg-primary-color hover:-translate-y-[5px] hover:[box-shadow:0_10px_20px_rgba(139,_0,_0,_0.2)] hover:bg-primary-light"
            >
              Contact Us
            </a>
            <a
              href="/faq"
              className="px-10 py-4 text-primary-color no-underline rounded-[8px] font-semibold text-[1.1rem] [transition:all_0.3s_ease] inline-blockbg-[white] border-[2px] border-[solid] border-primary-color hover:-translate-y-[5px] hover:[box-shadow:0_10px_20px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:text-[white]"
            >
              View FAQs
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
