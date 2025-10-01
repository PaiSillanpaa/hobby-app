import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import MobileAdminRedirectModal from "../components/MobileAdminRedirectModal";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMobileAdminModal, setShowMobileAdminModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const rank = localStorage.getItem("rank");
      const token = localStorage.getItem("token");

      if (!isMobile && token && showMobileAdminModal) {
        setShowMobileAdminModal(false);
        if (rank === "admin") {
          navigate("/admin");
        } else if (rank === "company") {
          navigate("/company");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, showMobileAdminModal]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isMobile = window.innerWidth < 768;


  // FOR DEV ONLY: Handle admin and company login
  if ((username === "admin" && password === "admin123") || (username === "company" && password === "company123") || (username === "user" && password === "user123")) {
    const rank = username === "admin" ? "admin" : username === "company" ? "company" : "user";
    

    localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NTkzMTQwNjUsImV4cCI6MTc5MDg1MDA2NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidXNlcl9taWtrbyIsImVtYWlsIjoibWlra29AZXhhbXBsZS5jb20iLCJyYW5rIjoidXNlciIsInVzZXJJZCI6IjMifQ.n1pku0Gbwlv-_xKq_XcKWXhtJ1n-ek-4bbsSCEO0TXs");
    localStorage.setItem("username", username);
    localStorage.setItem("rank", rank);

    if (rank === "user") {
      navigate("/user/homepage");
    } else {
      if (isMobile) {
        setShowMobileAdminModal(true);
      } else {
        navigate(rank === "admin" ? "/admin" : "/company");
      }
    }
    return;
  }


    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Kirjautuminen epäonnistui");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("rank", data.rank);

      const isAdminOrCompany = data.rank === "admin" || data.rank === "company";
      const targetPath = data.rank === "admin" ? "/admin" : data.rank === "company" ? "/company" : "/homepage";

      if (isMobile && isAdminOrCompany) {
        setShowMobileAdminModal(true);
      } else {
        navigate(targetPath);
      }
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Kirjautuminen epäonnistui: " + err.message);
    }
  };

  const handleContinueDesktop = () => {
    setShowMobileAdminModal(false);
    const rank = localStorage.getItem("rank");
    navigate(rank === "admin" ? "/admin" : "/company");
  };

  const handleContinueWithoutLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rank");
    setShowMobileAdminModal(false);
    navigate("/homepage");
  };

  return (
    <div className="form-container">
      <img src={logo} alt="Logo" className="landing-logo" />
      <p className="landing-subtitle">
        Let’s find out {"\n"}your next {"\n"}favourite hobby!
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          required
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />

        <button type="submit" className="continue-button">
          continue
        </button>

        <p className="landing-link" onClick={() => navigate("/homepage")}>
          continue without log in
        </p>
      </form>

      {showMobileAdminModal && (
        <MobileAdminRedirectModal
          onContinue={handleContinueDesktop}
          onLogout={handleContinueWithoutLogin}
        />
      )}
    </div>
  );
}
