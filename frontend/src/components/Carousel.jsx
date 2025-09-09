import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import sailingImg from "../assets/sailing.png";
import paintingImg from "../assets/painting.png";
import basketballImg from "../assets/basketball.png";
import guitarImg from "../assets/guitar.png";

import "./Carousel.css";

export default function Carousel() {
  const slides = [
    { image: sailingImg, title: "Sailing" },
    { image: paintingImg, title: "Painting" },
    { image: basketballImg, title: "Basketball" },
    { image: guitarImg, title: "Guitar" },
  ];

  const navigate = useNavigate();

  return (
    <div className="carousel-wrapper">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={40}
        slidesPerView="auto" // näyttää useamman kerralla responsiivisesti
        grabCursor={true}   // mahdollistaa dragin hiirellä/peukalolla
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        allowTouchMove={true}
        className="carousel"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ width: "170px" }}> {/* width CSS:n mukaan */}
            <div className="carousel-box">
              <div className="carousel-content" onClick={() => navigate(`/${slide.title}`)}>
                <img src={slide.image} alt={slide.title} className="carousel-image" />
                <div className="carousel-footer">
                  <span className="carousel-title">{slide.title}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
