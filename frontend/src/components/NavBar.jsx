import { useState, useEffect } from "react";
import homeIcon from "../assets/home.png";
import searchIcon from "../assets/search.png";
import mapIcon from "../assets/map.png";
import profileIcon from "../assets/profile.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import { fetchUserId } from "../utils/UserData";
import { getUserIdFromToken } from "../utils/Token";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await fetchUserId();
        setUserId(id);
      } catch (err) {
        console.error(err);
        const id = getUserIdFromToken(); // Poista tämä ja seuraava rivi, kun backend on yhdistetty
        setUserId(id);
        //setUserId(null); // Tämä käyttöön, kun backend on yhdistetty
      }
    };

    getUserId();
  }, []);
  
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleNavigation = (page) => {
    if (userId) {
      navigate(`/user/${page}`);
    } else {
      navigate(`/${page}`);
    }
  };

  const handleProfileClick = () => {
    handleNavigation("profile");
  };


  return (
    <>
      {searchOpen && (
        <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} toggleSearch={toggleSearch} />
      )}

      <nav className="navbar">
        <button onClick={() => handleNavigation("homepage")} className="nav-item">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span>Home</span>
        </button>

        <button onClick={toggleSearch} className="nav-item">
          <img src={searchIcon} alt="Search" className="nav-icon" />
          <span>Search</span>
        </button>

        <button onClick={() => handleNavigation("map")} className="nav-item">
          <img src={mapIcon} alt="Map" className="nav-icon" />
          <span>Map</span>
        </button>

        <button onClick={handleProfileClick} className="nav-item">
          <img src={profileIcon} alt="Profile" className="nav-icon" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}
