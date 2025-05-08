import React, { useState, useEffect } from "react";
import about from '../../../api/apiAboutUs';
import createIcon from '../../../helpers/genIcons';

const CoreValuesPage = () => {
    const [coreValues, setCoreValues] = useState([]);   
    
    useEffect(() => {
        const fetchCoreValues = async () => {
            try {
                const response = await about.getAllCoreValues();
                setCoreValues(response.data);                
            } catch (error) {
                console.error("Error fetching core values:", error);
            }
        };
        fetchCoreValues();
    }, []);

    return (
        <section className="px-8 py-20 max-w-[1200px] mx-[auto] my-[0] even:bg-light-color md:px-6 md:py-12">
            <h2 className="text-center text-[2.5rem] mb-12 relative inline-block left-2/4 -translate-x-1/2 text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[80px] after:h-[3px] after:[transition:width_0.3s_ease] hover:after:w-[120px] md:text-[2rem]">
            Our Core Values
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-8">
                {coreValues?.map((value, index) => (
                    <div
                        key={index} 
                        className="bg-[white] p-8 rounded-[15px] [box-shadow:0_10px_20px_rgba(0,_0,_0,_0.05)] text-center [transition:all_0.3s_ease] animate-[fadeInUp_0.8s_ease-out_forwards] hover:-translate-y-[10px] hover:[box-shadow:0_15px_30px_rgba(0,_0,_0,_0.1)] sm:p-6"
                    >
                        <div className="text-[2.5rem] mb-4 text-primary-color sm:text-[2rem]">
                            {createIcon(value.icon)}
                        </div>
                        <h3 className="text-[#343a40] text-[1.3rem] mb-4">
                            {value.title}
                        </h3>
                        <p className="text-[#555] leading-[1.6]">
                            {value.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CoreValuesPage;