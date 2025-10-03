import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MapCarousel.css";

export default function NewCarousel({
  hobbies: displayedHobbies = [],
  onHobbyClick,
  selectedHobby,
  isMapPage
}) {
  return (
    <div className="carousel-wrapper">
    <h3 className="carousel-title-header">Nearby Hobbies</h3>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
        {displayedHobbies.map((hobby) => {
          const isSelected = hobby.name === selectedHobby;

          return (
            <SwiperSlide key={hobby.id} style={{ width: "170px" }}>
              <div
                className={`card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onHobbyClick(hobby);
                }}
                style={isMapPage ? { transform: isSelected ? "scale(1.1)" : "scale(1)" } : {}}
              >
                <div className="carousel-content">
                  <img
                    src={`../assets/${hobby.image}`}
                    alt={hobby.title}
                    className="carousel-image"
                  />
                  <img
                    src={"../assets/Heart.svg"}
                    alt="favorite"
                    className={`heart-icon ${isSelected ? "filled" : ""}`}
                  />
                  <div className="carousel-footer">
                    <span className="carousel-title">{hobby.title}</span>
                    <img src="../assets/Info.png" className="info-image" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
