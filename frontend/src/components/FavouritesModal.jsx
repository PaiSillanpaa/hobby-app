import { useEffect, useState } from "react";
import "./FavouritesModal.css";

export default function FavouritesModal({ onClose }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/user/favourites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavourites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Virhe haettaessa suosikkeja:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Your Favourites</h2>

      {loading ? (
        <p>Loading...</p>
      ) : favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div className="favourites-grid">
          {favourites.map((item) => (
            <div key={item.id} className="favourites-card">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.title}
                className="favourites-image"
              />
              <p className="favourites-title">{item.title}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}
