import React, { useState, useEffect } from "react";
import { FaUsers, FaChevronRight } from "react-icons/fa";
import about from '../../../api/apiAboutUs';
import CoreValues from './CoreValues'
import AchievementsPage from './Achievements'
import LeadershipTeam from './LeadershipTeam'
import Experience from './Experience'

const AboutUs = () => {
  const [ourInformation, setOurInformation] = useState([]);


  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await about.getAllAboutUs();
        const sortedData = response.data.sort((a, b) => {
          if (a.title === 'Our Story') return -1;
          if (b.title === 'Our Story') return 1;
          return 0;
        });
        setOurInformation(sortedData);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchAboutUs();
  }, []);

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

      <div className="text-[1.5rem] flex items-center gap-2 text-primary-color px-8 pt-20 max-w-[1200px] mx-[auto] my-[0] md:px-6 md:py-12">
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
      
      <div>
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
          <div className="text-center max-w-[800px] mx-[auto] my-[0] animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h2 className="text-[2.5rem] text-primary-color mb-6 relative inline-block after:contents-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color md:text-[2rem]">
              {ourInformation[0]?.title}
            </h2>
            {ourInformation[0]?.content?.split('\n').map((paragraph, index) => (
              <p key={index} className="text-[1.1rem] leading-[1.7] text-[#555] mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
          <div className="flex flex-wrap gap-8 justify-center">
            {ourInformation.slice(1)?.map((info, index) => (
              <div 
                key={index} 
                className="flex-[1] min-w-[300px] animate-[fadeInUp_0.8s_ease-out_forwards]"
              >
                <div className="bg-[white] p-10 rounded-[15px] [box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] h-full [transition:all_0.3s_ease] relative overflow-hidden before:content-[''] before:absolute before:top-[0] before:left-[0] before:w-full before:h-full before:bg-[linear-gradient(_to_bottom,_rgba(139,_0,_0,_0)_0%,_rgba(139,_0,_0,_0.1)_100%_)] before:opacity-0 before:[transition:opacity_0.4s_ease] before:pointer-events-none hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.15)] hover:before:opacity-100">
                  <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color hover:after:w-full md:p-6">
                    {info.title}
                  </h3>
                  <p className="text-[1.1rem] leading-[1.7] text-[#555]">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CoreValues/>

        <LeadershipTeam/>

        <AchievementsPage/>

        <Experience/>

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
