import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminView from "./AdminView";
import MobileAdminRedirectModal from "./MobileAdminRedirectModal";

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null); // Alkuun null -> ei tiedetä vielä
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  useEffect(() => {
    // Tarkista admin-status localStoragesta
    const userRole = localStorage.getItem("rank");
    setIsAdmin(userRole === "admin");

    // Näytön koon kuuntelu
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAdmin === null) {
    // Odotetaan localStoragen lukemista
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/homepage" replace />;
  }

  if (!isDesktop) {
    return (
      <MobileAdminRedirectModal
        onLogout={() => {
          // Poista kirjautumistiedot
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("rank");
          navigate("/homepage");
        }}
      />
    );
  }

  return <AdminView />;
}
