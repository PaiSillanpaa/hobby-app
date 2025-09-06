import { useState } from "react";
import homeIcon from "../assets/home.png";
import searchIcon from "../assets/search.png";
import mapIcon from "../assets/map.png";
import profileIcon from "../assets/profile.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => setSearchOpen(!searchOpen);
  const navigate = useNavigate();

  return (
    <>
      {/* Modal / popup for Search */}
      {searchOpen && (
        <div className="search-modal">
          <div className="search-content">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button onClick={toggleSearch} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <button onClick={() => navigate("/homepage")} className="nav-item">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span>Home</span>
        </button>

        <button onClick={toggleSearch} className="nav-item">
          <img src={searchIcon} alt="Search" className="nav-icon" />
          <span>Search</span>
        </button>

        <button onClick={() => navigate("/map")} className="nav-item">
          <img src={mapIcon} alt="Map" className="nav-icon" />
          <span>Map</span>
        </button>

        <button onClick={() => navigate("/profile")} className="nav-item">
          <img src={profileIcon} alt="Profile" className="nav-icon" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}
