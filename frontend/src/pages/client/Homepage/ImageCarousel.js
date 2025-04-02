import React from "react";
import Slider from "react-slick";
// npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import gall1 from "../../../assets/gall1.jpg";
import gall2 from "../../../assets/gall2.jpg";
import gall3 from "../../../assets/gall3.jpg";
import gall4 from "../../../assets/gall4.jpg";
import gall5 from "../../../assets/gall5.jpg";
import gall6 from "../../../assets/gall6.jpg";
import gall7 from "../../../assets/gall7.jpg";

const photos = [
  { id: 1, src: gall1, alt: "1" },
  { id: 2, src: gall2, alt: "2" },
  { id: 3, src: gall3, alt: "3" },
  { id: 4, src: gall4, alt: "4" },
  { id: 5, src: gall5, alt: "5" },
  { id: 6, src: gall6, alt: "6" },
  { id: 7, src: gall7, alt: "7" },
];

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Ảnh tiếp theo"
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
      aria-label="Ảnh trước"
    >
      ❮
    </button>
  );
}

const ImageCarousel = () => {
  const settings = {
    className: "center", // Thêm class để CSS dễ hơn
    centerMode: true, // Kích hoạt chế độ center
    infinite: true, // Lặp vô hạn
    centerPadding: "15%", // Khoảng hở để thấy ảnh hai bên (điều chỉnh %)
    slidesToShow: 3, // Số lượng slide hiển thị CÙNG LÚC (bao gồm cả ảnh mờ 2 bên)
    speed: 600, // Tốc độ chuyển slide (ms)
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3500, // Thời gian dừng giữa các slide (ms)
    dots: true, // Hiển thị dấu chấm điều hướng
    arrows: true, // Hiển thị nút mũi tên
    nextArrow: <SampleNextArrow />, // Sử dụng nút tùy chỉnh
    prevArrow: <SamplePrevArrow />, // Sử dụng nút tùy chỉnh
    pauseOnHover: true, // Dừng khi di chuột vào
    cssEase: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", // Animation timing function
    responsive: [
      // Cấu hình cho các màn hình khác nhau
      {
        breakpoint: 1024, // Màn hình tablet lớn
        settings: {
          slidesToShow: 3,
          centerPadding: "10%",
        },
      },
      {
        breakpoint: 768, // Màn hình tablet nhỏ / mobile lớn
        settings: {
          slidesToShow: 1, // Chỉ hiện 1 ảnh chính giữa trên mobile
          centerPadding: "20%", // Tăng padding để ảnh 2 bên rõ hơn nếu muốn
          arrows: false, // Ẩn mũi tên trên mobile cho gọn
        },
      },
      {
        breakpoint: 480, // Màn hình mobile nhỏ
        settings: {
          slidesToShow: 1,
          centerPadding: "15%",
          arrows: false,
          dots: false, // Ẩn luôn dots cho tiết kiệm không gian
        },
      },
    ],
  };

  return (
    <div className="image-carousel-section">
      <div className="image-casousel-title-container">
        <h2 className="image-casousel-title">Some picture about us</h2>
      </div>
      <div className="image-carousel-container slick-initialized">
        {" "}
        <Slider {...settings}>
          {photos.map((photo) => (
            <div className="carousel-slide-wrapper" key={photo.id}>
              <div className="carousel-slide">
                <img src={photo.src} alt={photo.alt} />
                {/* <div className="slide-caption">{photo.alt}</div> */}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageCarousel;
