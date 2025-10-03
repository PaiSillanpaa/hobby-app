import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminView from "./AdminView";
import MobileAdminRedirectModal from "./MobileAdminRedirectModal";

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("rank");
    setIsAdmin(userRole === "admin");

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/homepage" replace />;
  }

  if (!isDesktop) {
    return (
      <MobileAdminRedirectModal
        onLogout={() => {
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
