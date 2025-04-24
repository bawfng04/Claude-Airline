import React, {useState, useEffect} from "react";
import inflight from "../../../assets/inflight-entertaining.jpg";
import comfortable from "../../../assets/comfortable-sitting.jpg";
import meal from "../../../assets/meal.webp";
import ServiceUnit from "./ServiceUnit";
import {API_URL, GET_SERVICES_API} from "../../../bang_config/apis";

const ServicesSection = () => {
  const [fetchedServices, setFetchedServices] = useState([]);


  const fetchServices = async () => {
    const response = await fetch(GET_SERVICES_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Fetched services:", data);
    if (response.ok) {
          let services = data.data;
          // xử lí đường dẫn ảnh
      services = services.map((service) => {
            const fullImagePath = service.service_image ? `${API_URL}/${service.service_image}` : null;
            return {
              ...service,
              service_fullImagePath: fullImagePath,
            };
          });
      setFetchedServices(services);
      console.log("Fetched services:", services);
    } else {
      console.error("Failed to fetch services:", data.message);
    }
  }

  useEffect(() => {
    fetchServices();
  }, [])

  return (
    <section className="services-section">
      <h2 className="services-title">Our Premium Services</h2>
      <p className="services-subtitle">
        Experience the comfort and luxury with our exclusive in-flight services
        designed to make your journey memorable.
      </p>
      <div className="services">
        <ServiceUnit
          img={inflight}
          title="Inflight Entertainment"
          description="Enjoy the latest movies, TV shows, and music with our state-of-the-art entertainment system."
          icon="fas fa-film"
          features={[
            "Over 100 movies available",
            "Live TV streaming",
            "Premium music collection",
            "Games for all ages",
          ]}
        />
        <ServiceUnit
          img={comfortable}
          title="Comfortable Seating"
          description="Relax in our ergonomically designed seats with extra legroom for maximum comfort throughout your flight."
          icon="fas fa-couch"
          features={[
            "Adjustable headrests",
            "Extended legroom",
            "Reclining capabilities",
            "USB charging ports",
          ]}
        />
        <ServiceUnit
          img={meal}
          title="Gourmet Dining"
          description="Savor delicious meals prepared by top chefs using fresh, high-quality ingredients for a memorable dining experience."
          icon="fas fa-utensils"
          features={[
            "Chef-prepared meals",
            "Special dietary options",
            "Premium beverage selection",
            "Complimentary snacks",
          ]}
        />
        {
          fetchedServices.map((ser) => {
            return (
              <ServiceUnit
                key={ser.id}
                img={ser.service_fullImagePath}
                title={ser.service_title}
                description={ser.service_description}
                icon="fas fa-utensils"
                features={[]}
              />
            );
          })
        }
      </div>
    </section>
  );
};

export default ServicesSection;
