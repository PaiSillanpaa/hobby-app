import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import hobbies from "../data/hobbies.json";
import "./MapPage.css";
import NavBar from "../components/NavBar";

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [closestHobbies, setClosestHobbies] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedHobby, setSelectedHobby] = useState(null);

  //Jos käyttäjä ei anna sijaintitietoja asetetaan default Rauttis

  // Käyttäjän sijainti
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
        });}
    );
  }, []);

  // Etäisyys
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Päivitä 2 lähintä harrastusta
  useEffect(() => {
    if (userLocation) {
      const sorted = hobbies
        .map((h) => ({
          ...h,
          distance: getDistance(
            userLocation.lat,
            userLocation.lon,
            h.coords[0],
            h.coords[1]
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);
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

  // Klikki listasta
  const focusOnHobby = (hobby) => {
    if (!map) return;
    setSelectedHobby(hobby.name);
    map.setView(hobby.coords, 15);
  };

  if (!userLocation) return <div>Loading your location...</div>;

  return (
    <div id="root">
      {/* Logo */}
      <header className="header">
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" />
        </div>
      </header>

      {/* Kartta */}
      <div className="map-container">
        <MapContainer
          center={[userLocation.lat, userLocation.lon]}
          zoom={13}
          className="map"
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Käyttäjä */}
          <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Harrastukset */}
          {hobbies.map((business, idx) => (
            <Marker
              key={idx}
              position={business.coords}
              icon={createHobbyIcon(business.title)}
            >
              <Popup open={selectedHobby === business.name}>
                <h4>{business.name}</h4>
                <p>{business.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Lähimmät harrastukset */}
      <div className="info-box">
        <h2>Hobbies close to you</h2>
        <div className="hobbies-list">
          {closestHobbies.map((hobby, index) => (
            <div
              key={index}
              className="hobby-item"
              onClick={() => focusOnHobby(hobby)}
            >
              <img
                src={`/assets/${hobby.image}`}
                alt={hobby.title}
                className="hobby-image"
              />
              <h3>{hobby.title}</h3>
              <p>{hobby.distance.toFixed(1)} km</p>
            </div>
          ))}
        </div>
      </div>
      <NavBar></NavBar>
    </div>
  );
};

export default MapPage;
