import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import hobbies from "../data/hobbies.json";
import { fetchUserId } from "../utils/UserData";
import { getUserIdFromToken } from "../utils/Token";
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
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await fetchUserId();
        setUserId(id);
        const favoritesResponse = await fetch(`/api/get-favorites/${id}`);
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);
        localStorage.setItem("favorites", JSON.stringify(favoritesData.map(f => f.id)));
      } catch (err) {
        console.error("No user found or backend error:", err);
        const id = getUserIdFromToken();
        setUserId(id);
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
      }
    };

    getUserId();
  }, []);

  // Handle clicking on a hobby's favorite button
  const handleFavoriteClick = async (e, hobby) => {
    e.stopPropagation();
    const isAlreadyFavorite = favorites.some(f => f.id === hobby.id);
    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter(f => f.id !== hobby.id);
      try {
        await fetch(`/api/remove-favorite/${userId}/${hobby.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } else {
      updatedFavorites = [...favorites, hobby];
      try {
        await fetch(`/api/add-favorite/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hobbyId: hobby.id })
        });
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

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
      } else if (location.pathname.includes("/user/homepage")) {
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
                <img
                  src={"../assets/Heart.svg"}
                  alt="favorite"
                  className={`heart-icon ${favorites.some(f => f.id === hobby.id) ? "filled" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleFavoriteClick(e, hobby); }}
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
