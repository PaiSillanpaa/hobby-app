import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchModal.css";

const SearchModal = ({ searchOpen, setSearchOpen }) => {
  const navigate = useNavigate();

  const areaFilters = ["Helsinki", "Espoo", "Vantaa", "Kauniainen", "Lohja"];
  const groupFilters = ["kids", "young", "adults", "seniors", "family activity"];
  const themeFilters = ["art", "sport", "culture", "cooking", "handcraft", "digital"];

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  const toggleFilter = (filter, selected, setSelected) => {
    if (selected.includes(filter)) {
      setSelected(selected.filter(f => f !== filter));
    } else {
      setSelected([...selected, filter]);
    }
  };

  const handleContinue = () => {
    const queryParams = new URLSearchParams();

    if (selectedAreas.length > 0) {
      queryParams.set("area", selectedAreas.join(","));
    }
    if (selectedGroups.length > 0) {
      queryParams.set("group", selectedGroups.join(","));
    }
    if (selectedThemes.length > 0) {
      queryParams.set("theme", selectedThemes.join(","));
    }

    setSearchOpen(false);

    const isLoggedIn = !!localStorage.getItem("token"); 
    const basePath = isLoggedIn ? "/user/categories" : "/categories";

    const queryString = queryParams.toString();
    const fullPath = queryString ? `${basePath}?${queryString}` : basePath;

    navigate(fullPath);
  };


  return (
    searchOpen && (
      <div className="search-modal">
        <div className="search-content">

          <h2 className="modal-title">Search hobby for you:</h2>

          <div className="filter-group">
            <div className="button-group">
              {areaFilters.map(area => (
                <button
                  key={area}
                  className={`filter-button ${selectedAreas.includes(area) ? "selected" : ""}`}
                  onClick={() => toggleFilter(area, selectedAreas, setSelectedAreas)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="button-group">
              {groupFilters.map(group => (
                <button
                  key={group}
                  className={`filter-button ${selectedGroups.includes(group) ? "selected" : ""}`}
                  onClick={() => toggleFilter(group, selectedGroups, setSelectedGroups)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="button-group">
              {themeFilters.map(theme => (
                <button
                  key={theme}
                  className={`filter-button ${selectedThemes.includes(theme) ? "selected" : ""}`}
                  onClick={() => toggleFilter(theme, selectedThemes, setSelectedThemes)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleContinue} className="contin-button">
            Continue
          </button>

        </div>
      </div>
    )
  );
};

export default SearchModal;
