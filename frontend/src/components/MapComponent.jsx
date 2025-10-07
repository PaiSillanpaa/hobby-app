import { useEffect, useState } from "react";

const MapComponent = ({ location, setCoords }) => {
  const [loading, setLoading] = useState(false);
  const [coords, setLocalCoords] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
    if (!location) return;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchCoords = async () => {
  setLoading(true);
  setError(null);

  try {
    await sleep(1000);
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (your@email.com)", // Muista lisätä User-Agent
        },
      }
    );

    if (!response.ok) {
      throw new Error("Virhe haettaessa koordinaatteja");
    }

    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const newCoords = [lat, lon];

      if (
        !coords ||
        coords[0] !== newCoords[0] ||
        coords[1] !== newCoords[1]
      ) {
        setLocalCoords(newCoords);
        setCoords(newCoords);
      }
    } else {
      setError("Ei löytynyt koordinaatteja annetulle sijainnille");
    }
  } catch (err) {
    setError("Virhe haettaessa koordinaatteja: " + (err.message || "Tuntematon virhe"));
  } finally {
    setLoading(false);
  }
};

    fetchCoords();
  }, [location]);


  return (
    <div className="map-component">
      {loading && <p>Haetaan koordinaatteja...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {coords && (
        <div>
          <p><strong>Koordinaatit:</strong> {coords[0]}, {coords[1]}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
