import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password, "Email:", email);
    // tänne API-kutsu tms. myöhemmin
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

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />

        <button type="submit" className="continue-button">
          continue
        </button>
        <p className="landing-link" onClick={() => navigate("/homepage")}>
            continue without registeration
        </p>
      </form>
    </div>
  );
}
