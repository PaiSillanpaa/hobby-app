import { useEffect, useState } from "react";
import "./OwnHobbiesModal.css";

export default function OwnHobbiesModal({ onClose }) {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/user/hobbies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHobbies(data); // odotetaan että backend palauttaa arrayn
        setLoading(false);
      })
      .catch((err) => {
        console.error("Virhe haettaessa harrastuksia:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Your Hobbies</h2>

      {loading ? (
        <p>Loading...</p>
      ) : hobbies.length === 0 ? (
        <p>No hobbies found.</p>
      ) : (
        <div className="hobby-grid">
          {hobbies.map((hobby) => (
            <div key={hobby.id} className="hobby-card">
              <img
                src={hobby.image || "/placeholder.jpg"}
                alt={hobby.title}
                className="hobby-image"
              />
              <p className="hobby-title">{hobby.title}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}
