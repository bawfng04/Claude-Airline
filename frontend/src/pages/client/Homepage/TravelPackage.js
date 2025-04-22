import React, { useState, useEffect } from "react";
import f1 from "../../../assets/f1.jpg";
import uefa from "../../../assets/uefa.jpg";
import christmas from "../../../assets/christmas.webp";
import { GET_TRAVEL_PACKAGES_API, API_URL } from "../../../bang_config/apis";

const TravelPackage = () => {

  const [fetchedPackage, setFetchedPackage] = useState([]);

  const fetchTravelPackages = async () => {
    try {
      const response = await fetch(GET_TRAVEL_PACKAGES_API);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // xử lí thêm cái đường dẫn cho image
      const processedData = data.data.map((pkg) => ({
        ...pkg, // giữ nguyên các thuộc tính khác
        fullImagePath: pkg.package_image? `${API_URL}/${pkg.package_image}` : null,
      }))
      console.log("data: ", data);
      console.log("processedData: ", processedData);
      setFetchedPackage(processedData);
    } catch (error) {
      console.error("Error fetching travel packages:", error);
    }
  }

  useEffect(() => {
    fetchTravelPackages();
  }, [])

  return (
    <div className="travel-package-container">
      <h2 className="travel-package-title">Looking for a travel package?</h2>
      <h3 className="travel-package-subtitle">
        Check out our travel packages to make your trip planning easier.
      </h3>
      <div className="travel-packages">
        <div className="travel-package-unit">
          <img src={f1} alt="F1" className="travel-package-image" />
          <h3 className="travel-package-name">F1 Grand Prix</h3>
          <p className="travel-package-description">
            Experience the thrill of Formula 1 racing with our exclusive travel
            package.
          </p>
        </div>
      </div>
      <div className="travel-packages">
        <div className="travel-package-unit">
          <img src={uefa} alt="UEFA" className="travel-package-image" />
          <h3 className="travel-package-name">UEFA Champions League</h3>
          <p className="travel-package-description">
            Watch the UEFA Champions League final live with our travel package.
          </p>
        </div>
      </div>
      <div className="travel-packages">
        <div className="travel-package-unit">
          <img
            src={christmas}
            alt="Christmas"
            className="travel-package-image"
          />
          <h3 className="travel-package-name">Christmas in Europe</h3>
          <p className="travel-package-description">
            Celebrate Christmas in Europe with our special travel package.
          </p>
        </div>
      </div>
      {Array.isArray(fetchedPackage) &&
        fetchedPackage.map((pkg, index) => (
          <div className="travel-packages" key={index}>
            <div className="travel-package-unit" key={pkg.id || pkg.name}>
              {" "}
              <img
                src={pkg.fullImagePath || "placeholder.jpg"} // Có ảnh dự phòng là tốt
                alt={pkg.name}
                className="travel-package-image"
              />
              <h3 className="travel-package-name">
                {pkg.package_name || "Unnamed Package"}
              </h3>{" "}
              <p className="travel-package-description">
                {pkg.package_description || "No description available."}
              </p>{" "}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TravelPackage;
