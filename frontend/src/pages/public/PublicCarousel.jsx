import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
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
  const [hobbies, setHobbies] = useState([]);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const [loading, setLoading] = useState(true); // Lataustila

  // Haetaan harrastukset backendistä
  useEffect(() => {
    const getHobbies = async () => {
      try {
        const hobbiesResponse = await fetch("/api/listing/active2");
        const hobbiesData = await hobbiesResponse.json();
        setHobbies(hobbiesData); // Tallennetaan ladatut tiedot
        setLoading(false); // Data ladattu
      } catch (err) {
        console.error("Error while fetching hobbies:", err);
        setLoading(false);
      }
    };

    getHobbies();
  }, []);

  // Suodatetaan harrastukset heti, kun `hobbies` muuttuu
  useEffect(() => {
    if (!loading) {
      let appliedCategory = category;
      let appliedType = type;

      let filtered = [...hobbies]; // Kopioidaan alkuperäiset tiedot

      // Käydään suodattimen logiikka läpi
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

      // Suodatetaan listaa
      filtered = filtered.filter(hobby => {
        let match = true;
        if (appliedCategory && !hobby.category.includes(appliedCategory)) match = false;
        if (city && !hobby.location.city.toLowerCase().includes(city.toLowerCase())) match = false;
        if (age && !hobby.age.includes(age)) match = false;
        if (appliedType && hobby.type !== appliedType) match = false;
        return match;
      });

      // Päivitetään suodatetut harrastukset
      setFilteredHobbies(filtered);
    }
  }, [category, city, age, type, title, location.pathname, hobbies, loading]); // Kun `hobbies` ja muut muuttuvat

  // Käsitellään suosikiksi lisäämistä
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

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

      {loading ? (
        <p>Loading hobbies...</p> // Latausviesti ennen kuin data on valmis
      ) : (
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
              <div className="card" onClick={() => navigate(`/${hobby.listingTitle}/${hobby.company}`)}>
                <div className="carousel-content">
                  <img src={`../assets/${hobby.category}.png`} alt={hobby.listingTitle} className="carousel-image" />
                  <img
                    src={"../assets/Heart.svg"}
                    alt="favorite"
                    className="heart-icon"
                    onClick={(e) => { e.stopPropagation(); handleFavoriteClick(e); }}
                  />
                  <div className="carousel-footer">
                    <span className="carousel-title">{hobby.listingTitle}</span>
                    <img src="../assets/Info.png" className="info-image" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
