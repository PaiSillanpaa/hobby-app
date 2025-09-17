import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carousel.css";

import sailingImg from "../assets/sailing.png";
import paintingImg from "../assets/painting.png";
import basketballImg from "../assets/basketball.png";
import guitarImg from "../assets/guitar.png";


export default function Carousel() {
  const slides = [
    { image: sailingImg, title: "Sailing" },
    { image: paintingImg, title: "Painting" },
    { image: basketballImg, title: "Basketball" },
    { image: guitarImg, title: "Guitar" },
  ];

  const navigate = useNavigate();

  return (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ width: "170px" }}>
            <div className="card" onClick={() => navigate(`/${slide.title}`)}>
              <div className="carousel-content">
                <img src={slide.image} alt={slide.title} className="carousel-image" />
                <div className="carousel-footer">
                  <span className="carousel-title">{slide.title}</span>
                  <img src="../assets/Info.png" className="info-image"></img>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  );
}
