import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import hobbies from "../data/hobbies.json";
import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";
import { useFilteredHobbiesByLocation } from "../utils/FilterHobbies";
import "./MapPage.css";

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const location = useLocation();

  // Hakee käyttäjän sijainnin
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

  const closestHobbies = useFilteredHobbiesByLocation(userLocation, hobbies);
   


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
            >
              <Popup>
                <h4>{business.title}</h4>
                <p>{business.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Varmistetaan, että karuselli näkyy vain /user/map tai /map -sivuilla */}
      {(location.pathname === "/user/map" || location.pathname === "/map") && (
        <div className="info-box">
          <Carousel
            title="Nearby Hobbies"
            userLocation={userLocation}  // Välitetään koordinaatit Carouselille
            displayedHobbies={closestHobbies}  // Välitetään lähimmät harrastukset
          />
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default MapPage;
