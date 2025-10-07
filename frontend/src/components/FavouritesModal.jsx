import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { getUserIdFromToken } from "../utils/Token";
import "./FavouritesModal.css";
const baseurl = "https://hobbly-app.onrender.com";

export default function FavouritesModal({ onClose }) {
  const [favourites, setFavourites] = useState({ favourites: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserfavourites = async () => {
      try {
        const res = await fetch(`${baseurl}/api/listing/favourites`);
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

  const handlefavouriteClick = async (e, hobby) => {
    e.stopPropagation();

    try {
      // Poistetaan suosikki
      await fetch(`${baseurl}/api/listing/remove-favourite`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: hobby._id }),
      });

      const res = await fetch(`${baseurl}/api/listing/favourites`);
      if (!res.ok) throw new Error("Failed to fetch favourites");
      const data = await res.json();
      setFavourites(data); // Päivitetään suosikit heti poiston jälkeen
    } catch (err) {
      console.error("Error removing favourite:", err);
    }
  };

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
                alt="favourite"
                className={`favourites-heart ${favourites.favourites.some(f => f.listingId === item.listingId) ? "favourites-heart-filled" : ""}`}
                onClick={(e) => handlefavouriteClick(e, item)}
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}
