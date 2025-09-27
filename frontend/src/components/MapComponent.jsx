import { useEffect, useState } from "react";

const MapComponent = ({ location, setCoords }) => {
  const [loading, setLoading] = useState(false);
  const [coords, setLocalCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchCoords = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );

        if (!response.ok) {
          throw new Error("Virhe haettaessa koordinaatteja");
        }

        const data = await response.json();

        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const newCoords = [lat, lon];

          setLocalCoords(newCoords);
          setCoords(newCoords); // palautetaan parent-komponentille
        } else {
          setError("Ei löytynyt koordinaatteja annetulle sijainnille");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [location, setCoords]);

  return (
    <div className="map-component">
      {loading && <p>Haetaan koordinaatteja...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {coords && (
        <div>
          <p><strong>Koordinaatit:</strong> {coords[0]}, {coords[1]}</p>
          {/* tähän voisi myöhemmin lisätä oikean kartan esim. Leafletillä */}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
