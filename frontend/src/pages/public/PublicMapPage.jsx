import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
//import hobbies from "../data/hobbies.json";
import NavBar from "./PublicNavBar";
//import { useLocation } from "react-router-dom";
import Carousel from "./PublicCarousel";
import { useFilteredHobbiesByLocation } from "../../utils/FilterHobbies";
import "../MapPage.css";
const baseurl = "https://hobbly-app.onrender.com";


const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  //const location = useLocation();

  // Hakee käyttäjän sijainnin
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user location
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
              lat: 60.1699,
              lon: 24.9384,
            });
          }
        );

        const hobbiesResponse = await fetch(`${baseurl}/api/listing/active2`);
        const hobbiesData = await hobbiesResponse.json();
        setHobbies(hobbiesData);
      } catch (error) {
        console.error("Error fetching hobbies data:", error);
      }
    };

    fetchData();
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
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {closestHobbies.map((business, idx) => (
            <Marker
              key={idx}
              position={business.location.coordinates}
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
        <div className="info-box">
          <Carousel
            title="Creating your own adventure"
          />
        </div>
      <NavBar />
    </div>
  );
};

export default MapPage;

// userLocation={userLocation}
// displayedHobbies={closestHobbies}