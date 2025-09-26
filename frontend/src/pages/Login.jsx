import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import MobileAdminRedirectModal from "../components/MobileAdminRedirectModal"; // tämä pitää olla olemassa!

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showMobileAdminModal, setShowMobileAdminModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

      // DEV: kovakoodattu admin testikäyttöön
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("token", "dev-token");
    localStorage.setItem("username", "admin");
    localStorage.setItem("rank", "admin");

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setShowMobileAdminModal(true);
    } else {
      navigate("/admin");
    }
    return;
  }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Kirjautuminen epäonnistui");
      }

      const data = await res.json();

      // Talleta token ja muut tiedot localStorageen
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("rank", data.rank);

      const isMobile = window.innerWidth < 768;
      const isAdminOrCompany = data.rank === "admin" || data.rank === "company";

    if (isAdminOrCompany) {
      if (isMobile) {
        setShowMobileAdminModal(true);
      } else {
        // Jos admin desktopilla, ohjataan admin-näkymään
        navigate("/admin");
      }
    } else {
      // Tavallinen käyttäjä ohjataan homepageen
      navigate("/homepage");
    }

    } catch (err) {
      console.error("Login error:", err.message);
      alert("Kirjautuminen epäonnistui: " + err.message);
    }
  };

  const handleContinueDesktop = () => {
    setShowMobileAdminModal(false);
    navigate("/admin"); // voit vaihtaa oikeaan admin/company -näkymään
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
      <p className="landing-subtitle">Let’s find out {"\n"}your next {"\n"}favourite hobby!</p>

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
