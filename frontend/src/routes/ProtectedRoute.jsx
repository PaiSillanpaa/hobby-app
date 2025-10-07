import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
const baseurl = "https://hobbly-app.onrender.com/";
const ProtectedRoute = ({ allowedRanks }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Käyttäjän valtuutuksen tila
  const [error, setError] = useState(null); // Virhetila

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${baseurl}/api/user/info`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

        const data = await response.json();
        const rank = data.rank;
        console.log(rank);

        // Tarkistetaan, onko käyttäjällä oikeus (rank kuuluu allowedRanks:iin)
        if (allowedRanks.includes(rank)) {
          setIsAuthorized(true); // Käyttäjä on valtuutettu
        } else {
          setError(new Error("Ei oikeuksia tälle sivulle")); // Ei oikeuksia
        }
      } catch (err) {
        setError(err); // Asetetaan virhe
      }
    };

    checkUser(); // Käynnistetään käyttäjätarkistus
  }, []); // Tämä ajetaan aina, kun allowedRanks muuttuu

  // Odotetaan, että tarkistus valmistuu
  if (isAuthorized === null) {
    return <div>Loading...</div>; // Voit lisätä latausindikaattorin
  }

  // Jos käyttäjällä ei ole oikeuksia tai on muu virhe
  if (error) {
    if (
      error.message === "Käyttäjän tunnistus epäonnistui" ||
      error.message === "Ei oikeuksia tälle sivulle"
    ) {
      return <Navigate to="/login" replace />; // Ohjataan käyttäjä pois
    }
    return <Navigate to="/login" replace />; // Muut virheet ohjaavat kirjautumissivulle
  }

  return <Outlet />; // Jos käyttäjä on valtuutettu, renderöi lapset (protected content)
};

export default ProtectedRoute;
