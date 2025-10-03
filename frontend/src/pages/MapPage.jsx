import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import hobbies from "../data/hobbies.json";
import NavBar from "../components/NavBar";
import NewCarousel from "../components/MapCarousel";
import { useLocation } from "react-router-dom";
import "./MapPage.css"

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [closestHobbies, setClosestHobbies] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const location = useLocation();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setUserLocation({
          lat: 60.1699,  // Helsingin Rautatieaseman leveysaste
          lon: 24.9384,  // Helsingin Rautatieaseman pituusaste
        });
      }
    );
  }, []);

  // Etäisyyden laskeminen käyttäjän sijainnista harrastuksiin
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Maapallon säde kilometreinä
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Etäisyys kilometreinä
  };

  // Päivitä 5 lähintä harrastusta
  useEffect(() => {
    if (userLocation) {
      const sorted = hobbies
        .map((hobby) => ({
          ...hobby,
          distance: getDistance(
            userLocation.lat,
            userLocation.lon,
            hobby.location[0].coords[0], // Koordinaatit
            hobby.location[0].coords[1]
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Valitaan vain 5 lähintä harrastusta
      setClosestHobbies(sorted);
    }
  }, [userLocation]);

  // Leafletin divIconit
  const userIcon = new L.DivIcon({
    className: "user-icon",
    html: "<div></div>",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const createHobbyIcon = (title) =>
    new L.DivIcon({
      className: "hobby-icon",
      html: `<div>${title}</div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });

  const focusOnHobby = (hobby) => {
    if (!map) return;
    setSelectedHobby(hobby.title);
    map.setView(hobby.location[0].coords, 15);
  };

  // Tarkistetaan, onko sivu "user/map"
  const isMapPage = location.pathname === "user/map";

  if (!userLocation) return <div>Loading your location...</div>;

  return (
    <div className="mappage-container">
        <div className="map-container">
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={13}
            className="map"
            whenCreated={setMap}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {closestHobbies.map((business, idx) => (
              <Marker
                key={idx}
                position={business.location[0].coords}
                icon={createHobbyIcon(business.title)}
                eventHandlers={{
                  click: () => focusOnHobby(business)
                }}
              >
                <Popup>
                  <h4>{business.title}</h4>
                  <p>{business.description}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="info-box">
          <NewCarousel
            hobbies={closestHobbies}
            onHobbyClick={focusOnHobby}
            selectedHobby={selectedHobby}
            isMapPage={isMapPage} // Tämä kertoo, onko sivu "/map"
          />
        </div>
        <NavBar />
    </div>
  );
};

export default MapPage;
