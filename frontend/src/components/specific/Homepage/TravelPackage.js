import React from "react";
import f1 from "../../../assets/f1.jpg";
import uefa from "../../../assets/uefa.jpg";
import christmas from "../../../assets/christmas.webp";

const TravelPackage = () => {
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
    </div>
  );
};

export default TravelPackage;
