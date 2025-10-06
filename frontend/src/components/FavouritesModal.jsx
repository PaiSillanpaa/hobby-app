import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserId } from "../utils/UserData";
import { getUserIdFromToken } from "../utils/Token";
import "./FavouritesModal.css";

export default function FavouritesModal({ onClose }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserFavorites = async () => {
      try {
        const id = await fetchUserId();
        setUserId(id);

        const res = await fetch(`/api/get-favorites/${id}`);
        if (!res.ok) throw new Error("Failed to fetch favourites");

        const data = await res.json();
        setFavourites(data);
      } catch (err) {
        console.error("Error fetching favourites:", err);

        // DEV fallback
        const id = getUserIdFromToken();
        setUserId(id);
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavourites(savedFavorites);
      } finally {
        setLoading(false);
      }
    };

    getUserFavorites();
  }, []);

  const handleFavoriteClick = async (e, hobby) => {
    e.stopPropagation();

    const isAlreadyFavorite = favourites.some(f => f.id === hobby.id);

    try {
      if (isAlreadyFavorite) {
        await fetch(`/api/remove-favorite/${userId}/${hobby.id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/add-favorite/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hobbyId: hobby.id }),
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="favourites-modal">
      <h2>Your Favourites</h2>

      {loading ? (
        <p>Loading...</p>
      ) : favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div className="favourites-list">
          {favourites.map((item) => (
            <div
              key={item.id}
              className="favourites-row"
              onClick={() => navigate(`/user/${item.title}/${item.company}`)}
            >
              <div className="favourites-info">
                <p className="favourites-title">
                  {item.title} - {item.company} - {item.location[0]?.city}
                </p>
              </div>
              <img
                src={"../assets/Heart.svg"}
                alt="favorite"
                className={`favourites-heart ${favourites.some(f => f.id === item.id) ? "favourites-heart-filled" : ""}`}
                onClick={(e) => handleFavoriteClick(e, item)}
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}
