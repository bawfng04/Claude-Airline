import React, { useState, useEffect } from "react";
import about from '../../../api/apiAboutUs';

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await about.getAllAchievements();
                setAchievements(response.data);
            } catch (error) {
                console.error("Error fetching achievements:", error);
            }
        };
        fetchAchievements();
    }, []);


    return (
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
          <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Achievements
          </h2>
          <div className="relative max-w-[800px] mx-[auto] my-[0] before:content-[''] before:absolute before:left-2/4 before:-translate-x-1/2 before:w-[4px] before:h-full before:opacity-30 before:bg-primary-color md:before:left-[30px]">
            {achievements.map((achievement, index) => (
                <div 
                    key={index}
                    className={`flex mb-10 relative animate-[fadeInUp_0.8s_ease-out_forwards] even:flex-row-reverse [animation-delay:${index * 0.2}s] md:!flex-row group`}
                >
                    <div className="min-w-[120px] text-center text-[white] px-4 py-2 rounded-[30px] font-semibold mx-8 my-[0] self-start [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] [transition:all_0.3s_ease] bg-primary-color group-hover:scale-110 lg:mx-4 lg:my-[0]md:min-w-[80px] md:mr-6 md:ml-0">
                        {achievement.year}
                    </div>
                    <div className="bg-[white] p-6 rounded-[10px] [box-shadow:0_5px_15px_rgba(0,_0,_0,_0.05)] flex-[1] max-w-half-minus-3rem [transition:all_0.3s_ease] group-hover:-translate-y-[5px] group-hover:[box-shadow:0_10px_25px_rgba(0,_0,_0,_0.1)] lg:half-minus-2rem md:full-minus-120px sm:p-4">
                        <h3 className="mb-2 text-[1.2rem] text-primary-color">
                            {achievement.title}
                        </h3>
                        <p className="text-[#555] leading-[1.6]">
                            {achievement.description}
                        </p>
                    </div>
                </div>
            ))}
          </div>
        </section>
    );
}

export default AchievementsPage;