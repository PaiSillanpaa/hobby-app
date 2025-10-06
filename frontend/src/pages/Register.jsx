import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import url from "../data/.env";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("user"); // oletus

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      alert("Salasanat eivät täsmää!");
      return;
    }

    const userData = {
      email,
      username,
      password1,
      password2,
      rank,
    };

    console.log("Rekisteröinti:", userData);

    try {
      const res = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Rekisteröinti epäonnistui");
      }

      const loginRes = await fetch(`${url}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password1,
        }),
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.message || "Automaattinen kirjautuminen epäonnistui");
      }

      const loginData = await loginRes.json();

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", loginData.username); // valinnainen
      localStorage.setItem("rank", loginData.rank);         // valinnainen

      navigate("/homepage");

      setUsername("");
      setEmail("");
      setPassword1("");
      setPassword2("");
      setRank("user");

    } catch (err) {
      console.error(err.message);
      alert("Rekisteröinti epäonnistui: " + err.message);
    }
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
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />

        <input
          type="password"
          placeholder="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          className="form-input"
          required
        />

        <input
          type="password"
          placeholder="confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="form-input"
          required
        />

        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="user"
              checked={rank === "user"}
              onChange={() => setRank("user")}
            />
            user account
          </label>

          <label>
            <input
              type="radio"
              value="company"
              checked={rank === "company"}
              onChange={() => setRank("company")}
            />
            company account
          </label>
        </div>

        <button type="submit" className="continue-button">
          continue
        </button>

        <p className="landing-link" onClick={() => navigate("/homepage")}>
          continue without registration
        </p>
      </form>
    </div>
  );
}
