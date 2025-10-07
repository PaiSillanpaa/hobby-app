import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { getUserIdFromToken } from "../utils/Token";
import "./FavouritesModal.css";

export default function FavouritesModal({ onClose }) {
  const [favourites, setFavourites] = useState({ favourites: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserfavourites = async () => {
      try {
        const res = await fetch(`/api/listing/favourites`);
        if (!res.ok) throw new Error("Failed to fetch favourites");
        const data = await res.json();
        setFavourites(data);
      } catch (err) {
        console.error("Error fetching favourites:", err);

        // DEV fallback
        //const id = getUserIdFromToken();
        //setUserId(id);
        //const savedfavourites = JSON.parse(localStorage.getItem("favourites")) || [];
       // setFavourites(savedfavourites);
      } finally {
        setLoading(false);
      }
    };

    getUserfavourites();
  }, []);

  const handleFavoriteClick = async (e, hobby) => {
    e.stopPropagation();

    let updatedfavourites;

      try {
        await fetch(`/api/listing/remove-favourite`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: hobby._id }),
        });

        // Poistetaan suosikki tilasta
        updatedfavourites = {
          ...favourites,
          favourites: favourites.favourites.filter(
            (f) => (f.listingId || f._id) !== hobby._id
          ),
        };
        setFavourites(updatedfavourites);
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } 

  return (
    <div className="favourites-modal">
      <h2>Your Favourites</h2>

      {loading ? (
        <p>Loading...</p>
      ) : favourites.favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div className="favourites-list">
          {favourites.favourites.map((item) => (
            <div
              key={item._id}
              className="favourites-row"
              onClick={() => navigate(`/user/${item.listingTitle}/${item.company}`)}
            >
              <div className="favourites-info">
                <p className="favourites-title">
                  {item.listingTitle} - {item.company}
                </p>
              </div>
              <img
                src={"/assets/Heart.svg"}
                alt="favorite"
                className={`favourites-heart ${favourites.favourites.some(f => f.listingId === item.listingId) ? "favourites-heart-filled" : ""}`}
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
