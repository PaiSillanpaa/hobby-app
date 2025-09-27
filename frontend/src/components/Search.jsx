import "./Search.css";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  return (
    <div className="search-container">
      <button onClick={() => navigate("/categories")}  className="search-button">Let's find out</button>
      <p className="search-helper-text">Search hobby, location, interest</p>
    </div>
  );
}