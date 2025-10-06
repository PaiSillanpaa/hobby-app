import "./Search.css";
import { useNavigate } from "react-router-dom";
import { fetchUserId } from "../utils/UserData";

export default function Search() {
  const navigate = useNavigate();
  const isLoggedIn = fetchUserId();

  const handleClick = () => {
    if (isLoggedIn) {
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
