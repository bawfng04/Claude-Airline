import React, { useState, useEffect } from "react";
import about from '../../../api/apiAboutUs';

const LeadershipTeam = () => {
    const [leadershipTeam, setLeadershipTeam] = useState([]);

    useEffect(() => {
        const fetchLeadershipTeam = async () => {
            try {
                const response = await about.getLeadershipTeam();
                setLeadershipTeam(response.data);
            }
            catch (error) {
                console.error("Error fetching leadership team data:", error);
            }
        }
        fetchLeadershipTeam();
    }, []);

    return (
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
            <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Leadership Team
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-8 sm:grid-cols-[1fr]">
                {leadershipTeam?.map((member, index) => (
                    <div
                        key={index}
                        className={`bg-[white] rounded-[15px] overflow-hidden [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:${index * 0.2}s] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] hover:scale-110`}
                    >
                        <div className="w-[120px] h-[120px] rounded-[50%] overflow-hidden mt-8 mx-[auto] mb-4 border-[3px] border-[solid] border-primary-color [transition:all_0.3s_ease] scale-110">
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}uploads/${member.image}`}
                                alt={member.position}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-[#343a40] text-[1.5rem] mb-2">{member.name}</h3>
                        <p className="font-semibold mb-4 text-primary-color">{member.position}</p>
                        <p className="text-[#555] pt-[0] px-6 pb-8 leading-[1.6]">{member.bio}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LeadershipTeam;