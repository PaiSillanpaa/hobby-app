import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import hobbies from "../data/hobbies.json";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carousel.css";

function getRandomHobbies(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Carousel({
    category = null,
  city = null,
  age = null,
  type = null,
  fallbackCount = 5
}) {
  const navigate = useNavigate();

const filteredHobbies = useMemo(() => {
      // Jos ei ole annettu yhtään suodatinta, otetaan satunnaiset 5 harrastusta
    if (!category && !city && !age && !type) {
      return getRandomHobbies(hobbies, fallbackCount);
    }
const results = hobbies.filter((hobby) => {
  const matchesCategory = category ? hobby.category === category : true;
  const matchesCity = city ? hobby.location.toLowerCase().includes(city.toLowerCase()) : true;
  const matchesAge = age ? hobby.age === age : true;
  const matchesType = type ? hobby.type === type : true;

  return matchesCategory && matchesCity && matchesAge && matchesType;
});


// Jos ei löydy mitään, palautetaan satunnaiset fallbackCount määrän harrastuksia
if (results.length === 0) {
  return getRandomHobbies(hobbies, fallbackCount);
}

return results;
}, [category, city, age, type]);

  return (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
        {filteredHobbies.map((hobby, index) => (
          <SwiperSlide key={hobby.id || index} style={{ width: "170px" }}>
            <div className="card" onClick={() => navigate(`/${hobby.title}/${hobby.company}`)}>
              <div className="carousel-content">
                <img src={`../assets/${hobby.image}`} alt={hobby.title} className="carousel-image" />
                <div className="carousel-footer">
                  <span className="carousel-title">{hobby.title}</span>
                  <img src="../assets/Info.png" className="info-image"></img>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  );
}
