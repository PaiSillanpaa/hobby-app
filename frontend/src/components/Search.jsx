import "./Search.css";
import { useNavigate } from "react-router-dom";
import { fetchUserId } from "../utils/UserData";
import { useState, useEffect } from "react";

export default function Search() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
  const checkUserStatus = async () => {
    const userId = await fetchUserId();
    setIsLoggedIn(userId);
  };

  checkUserStatus();
  }, []);

  const handleClick = () => {
    if (isLoggedIn != null) {
      navigate("/user/categories");
    } else {
      navigate("/categories");
    }
  };

  return (
    <div className="search-container">
      <button onClick={handleClick} className="search-button">
        Let's find out
      </button>
      <p className="search-helper-text">Search hobby, location, interest</p>
    </div>
  );
}
