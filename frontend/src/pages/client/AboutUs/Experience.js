import React, { useState, useEffect } from "react";
import about from '../../../api/apiAboutUs';
import { Link } from "react-router-dom";

const Experience = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await about.getAllExperiences();
                setExperiences(response.data);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            }
        };

        fetchExperiences();
    }, []);


    return (
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
            <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem] md:flex-col">
            The Airline Experience
            </h2>
            {experiences?.map((experience, index) => (
                <Link
                    to={`/${encodeURIComponent(experience.title.toLowerCase().replace(/\s+/g, '-'))}`}
                    key={index}
                    className={`flex flex-wrap items-center gap-12 mb-16 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:${index * 0.4}s] group`}
                >
                    <div className="flex-[1] min-w-[300px] max-w-[500px] overflow-hidden rounded-[15px] [box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] [transition:all_0.3s_ease] group-hover:-translate-y-[10px] group-hover:[box-shadow:0_20px_40px_rgba(0,_0,_0,_0.15)]">
                        <img
                        src={`${process.env.REACT_APP_BASE_URL}uploads/${experience.image}`}
                        alt={experience.title}
                        className="w-full h-auto block [transition:transform_0.5s_ease] group-hover:scale-105 md:w-full md:max-w-full"
                        />
                    </div>
                    <div className="flex-[1] min-w-[300px]">
                        <h3 className="text-[1.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[8px] after:left-[0] after:w-[50px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color group-hover:after:w-full">
                            {experience.title}
                        </h3>
                        {experience.descriptions?.map((desc, index) => (
                            <p key={index} className="text-[#555] leading-[1.7] text-[1.1rem] mb-4">
                                {desc}
                            </p>
                        ))}
                    </div>
                </Link>
            ))};
        </section>
    );
}

export default Experience;