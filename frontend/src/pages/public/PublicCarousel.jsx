import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import hobbies from "../../data/hobbies.json";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../components/Carousel.css";

export default function Carousel({
  title = "",
  category = null,
  city = null,
  age = null,
  type = null
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
      setShowPopup(true);
      return;
  }

  const filteredHobbies = useMemo(() => {
    let appliedCategory = category;
    let appliedType = type;

    if (!category && !type) {
      if (title === "Wanna be part of a team?") {
        appliedType = "group";
      } else if (title === "Creating your own adventure") {
        appliedType = "solo";
      } else if (title === "Or something totally else?") {
        const randomHobbies = hobbies.sort(() => Math.random() - 0.5).slice(0, 5);
        return randomHobbies;
      } else if (location.pathname.includes("/homepage")) {
        if (title === "Recent top searched hobbies") {
          const randomHobbies = hobbies.sort(() => Math.random() - 0.5).slice(0, 5);
          return randomHobbies;
        } else if (title === "New adventure in nature?") {
          appliedCategory = "nature";
        } else if (title === "Unleash your creativity") {
          appliedCategory = "art";
        }
      }
    }

    const scored = hobbies.map((hobby) => {
      let score = 0;
      if (appliedCategory && hobby.category.includes(appliedCategory)) score++;
      if (city && hobby.location.toLowerCase().includes(city.toLowerCase())) score++;
      if (age && hobby.age.includes(age)) score++;
      if (appliedType && hobby.type === appliedType) score++;
      return { ...hobby, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5);
  }, [category, city, age, type, title, location.pathname]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="carousel-wrapper">
      {title && <h3 className="carousel-title-header">{title}</h3>}
      
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You need to be a registered user to add to favorites.</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

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
                <img
                  src={"../assets/Heart.svg"}
                  alt="favorite"
                  className="heart-icon"
                  onClick={(e) => { e.stopPropagation(); handleFavoriteClick(e); }}
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
