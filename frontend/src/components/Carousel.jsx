import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import hobbies from "../data/hobbies.json";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carousel.css";

export default function Carousel({
  title = "",
  category = null,
  city = null,
  age = null,
  type = null
}) {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  const handleFavoriteClick = (e, hobby) => {
    e.stopPropagation(); // estää kortin click-navigaation

    const isAlreadyFavorite = favorites.some(f => f.id === hobby.id);

    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(f => f.id !== hobby.id));
      // backend DELETE /favorites/:id
    } else {
      setFavorites([...favorites, hobby]);
      // backend POST /favorites
    }
  };

  const filteredHobbies = useMemo(() => {
    // Lasketaan match-score jokaiselle harrastukselle
    const scored = hobbies.map((hobby) => {
      let score = 0;
      if (category && hobby.category.includes(category)) score++;
      if (city && hobby.location.toLowerCase().includes(city.toLowerCase())) score++;
      if (age && hobby.age.includes(age)) score++;
      if (type && hobby.type === type) score++;
      return { ...hobby, score };
    });

    // Järjestetään pisteiden mukaan laskevasti
    scored.sort((a, b) => b.score - a.score);

    // Otetaan vain top 5
    return scored.slice(0, 5);
  }, [category, city, age, type]);

  return (
    <div className="carousel-wrapper">
      {title && <h3 className="carousel-title-header">{title}</h3>}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
        {filteredHobbies.map((hobby) => (
          <SwiperSlide key={hobby.id} style={{ width: "170px" }}>
            <div className="card" onClick={() => navigate(`/${hobby.title}/${hobby.company}`)}>
              <div className="carousel-content">
                <img src={`../assets/${hobby.image}`} alt={hobby.title} className="carousel-image" />
                      {/* Heart button */}
              {/* Sydän nurkassa */}
                <img
                  src={"../assets/Heart.svg"}
                  alt="favorite"
                  className={`heart-icon ${favorites.some(f => f.id === hobby.id) ? "filled" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleFavoriteClick(hobby); }}
                />
                <div className="carousel-footer">
                  <span className="carousel-title">{hobby.title}</span>
                  <img src="../assets/Info.png" className="info-image" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
