import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GET_CAROUSEL_API, API_URL } from "../../../api/apis";

// Custom arrow components
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next image"
    >
      ❯
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous image"
    >
      ❮
    </button>
  );
}

const ImageCarousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(GET_CAROUSEL_API);
        const result = await response.json();

        if (result.status === 200 && Array.isArray(result.data)) {
          const processedImages = result.data.map((image) => ({
            id: image.id,
            src: `${API_URL}${image.carousel_image}`,
            alt: image.carousel_alt || "Airplane carousel image description",
            caption: image.carousel_caption,
          }));
          setCarouselImages(processedImages);
        } else {
          setError("Failed to load carousel images");
          console.error("Error fetching carousel data:", result.message);
        }
      } catch (error) {
        setError("Failed to load carousel images");
        console.error("Network error fetching carousel images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "15%",
    slidesToShow: 3,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3500,
    dots: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerPadding: "10%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "20%",
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "15%",
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="image-carousel-section">
        <div className="image-casousel-title-container">
          <h2 className="image-casousel-title">Loading images...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-carousel-section">
        <div className="image-casousel-title-container">
          <h2 className="image-casousel-title">Some pictures about us</h2>
          <p style={{ textAlign: "center", color: "#666" }}>
            Unable to load images at this time.
          </p>
        </div>
      </div>
    );
  }

  if (carouselImages.length === 0) {
    return null;
  }

  return (
    <div className="image-carousel-section">
      <div className="image-casousel-title-container">
        <h2 className="image-casousel-title">Some pictures about us</h2>
      </div>
      <div className="image-carousel-container slick-initialized">
        <Slider {...settings}>
          {carouselImages.map((photo) => (
            <div className="carousel-slide-wrapper" key={photo.id}>
              <div className="carousel-slide">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder.jpg";
                  }}
                />
                {photo.caption && (
                  <div className="slide-caption">{photo.caption}</div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageCarousel;
