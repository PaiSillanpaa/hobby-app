import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
//import hobbies from "../data/hobbies.json";
//import { fetchUserId } from "../utils/UserData";
//import { getUserIdFromToken } from "../utils/Token";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Carousel.css";

export default function Carousel({
  title = "",
  category = null,
  city = null,
  age = null,
  type = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [favourites, setfavourites] = useState({ favourites: [] });
  const [hobbies, setHobbies] = useState([]);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [userId, setUserId] = (null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        //const id = await fetchUserId();
        //setUserId(id);
        const favouritesResponse = await fetch(`/api/listing/favourites`);
        const favouritesData = await favouritesResponse.json();
        setfavourites(favouritesData);

        const hobbiesResponse = await fetch("/api/listing/active2");
        const hobbiesData = await hobbiesResponse.json();
        setHobbies(hobbiesData);
        setLoading(false);
        //localStorage.setItem("favourites", JSON.stringify(favouritesData.map(f => f.id)));
      } catch (err) {
        console.error("No user found or backend error:", err);
        //const id = getUserIdFromToken();
        //setUserId(id);
        //const savedfavourites = JSON.parse(localStorage.getItem("favourites")) || [];
        setfavourites(null);
      }
    };

    getUserId();
  }, []);

const handleFavoriteClick = async (e, hobby) => {
  e.stopPropagation();
  
  const isAlreadyFavorite = favourites.favourites.some(
    f => (f.listingId || f._id) === hobby._id
  );
  
  let updatedfavourites;

  if (isAlreadyFavorite) {
    try {
      await fetch(`/api/user/remove-favourite`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: hobby._id })
      });
      updatedfavourites = {
        ...favourites,
        favourites: favourites.favourites.filter(
          f => (f.listingId || f._id) !== hobby._id
        )
      };
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  } else {
    const newFav = { listingId: hobby._id };
    updatedfavourites = {
      ...favourites,
      favourites: [...favourites.favourites, newFav]
    };

    try {
      await fetch(`/api/listing/favourite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: hobby._id })
      });
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  }
  
  setfavourites(updatedfavourites);
};

  useEffect(() => {
    if (!loading) {
      let appliedCategory = category;
      let appliedType = type;

      let filtered = [...hobbies];

      if (!category && !type) {
        if (title === "Wanna be part of a team?") {
          appliedType = "group";
        } else if (title === "Creating your own adventure") {
          appliedType = "solo";
        } else if (title === "Or something totally else?") {
          filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 5);
        } else if (location.pathname.includes("/homepage")) {
          if (title === "Recent top searched hobbies") {
            filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 5);
          } else if (title === "New adventure in nature?") {
            appliedCategory = "nature";
          } else if (title === "Unleash your creativity") {
            appliedCategory = "art";
          }
        }
      }

      filtered = filtered.filter(hobby => {
        let match = true;
        if (appliedCategory && !hobby.category.includes(appliedCategory)) match = false;
        if (city && !hobby.location.city.toLowerCase().includes(city.toLowerCase())) match = false;
        if (age && !hobby.age.includes(age)) match = false;
        if (appliedType && hobby.type !== appliedType) match = false;
        return match;
      });

      setFilteredHobbies(filtered.slice(0, 5));
    }
  }, [category, city, age, type, title, location.pathname, hobbies, loading]);

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
          <SwiperSlide key={hobby._id} style={{ width: "170px" }}>
            <div className="card" onClick={() => navigate(`/user/${hobby.listingTitle}/${hobby.company}`)}>
              <div className="carousel-content">
                <img src={`/assets/${hobby.category[0]}.png`} alt={hobby.listingTitle} className="carousel-image" />
                <img
                  src={"/assets/Heart.svg"}
                  alt="favorite"
                  className={`heart-icon ${favourites.favourites.some(f => f.listingId === hobby._id) ? "filled" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleFavoriteClick(e, hobby); }}
                />
                <div className="carousel-footer">
                  <span className="carousel-title">{hobby.listingTitle}</span>
                  <img src="/assets/Info.png" className="info-image" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
