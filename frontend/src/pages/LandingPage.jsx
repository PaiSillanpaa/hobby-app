import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <img src={logo} alt="Logo" className="landing-logo" />
      <p className="landing-subtitle">Let’s find out {"\n"}your next {"\n"}favourite hobby!</p>
      <div className="landing-buttons">
        <button className="landing-button" onClick={() => navigate("/login")}>
          log in
        </button>
        <button className="landing-button" onClick={() => navigate("/register")}>
          register
        </button>
      </div>
      <p className="landing-link" onClick={() => navigate("/homepage")}>
        continue without registeration
      </p>
    </div>
  );
}