import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminView from "./AdminView";
import MobileAdminRedirectModal from "./MobileAdminRedirectModal";
import { fetchRank, deleteCookie } from "../utils/UserData";

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  useEffect(() => {
    // Hakee käyttäjän roolin ja päivittää isAdminin sen mukaan
    const fetchUserRole = async () => {
      const userRole = await fetchRank(); // Oletetaan, että fetchRank palauttaa lupauksen
      if (userRole === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    fetchUserRole();

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  if (!isDesktop) {
    return (
      <MobileAdminRedirectModal
        onLogout={() => {
          deleteCookie();
          navigate("/homepage");
        }}
      />
    );
  }

  return <AdminView />;
}
