import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import OwnHobbiesModal from "../components/OwnHobbiesModal";
import FavouritesModal from "../components/FavouritesModal";
import "./ProfilePage.css";
import Carousel from "../components/Carousel";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // Modalin tila: mikä modal on auki? esim "hobbies", "favourites", "changePassword", tai null = kiinni
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    setUsername(storedUsername || "");
    setEmail(storedEmail || "");
  }, []);

  // Sulje modaalit
  function closeModal() {
    setActiveModal(null);
  }

  return (
    <div className="profilepage-container">
    <div className="everything-wrapper">
    <div className="another-w">
      <div className="image-wrapper-pp">
        <img src="../assets/guitar.png" alt="instruments" className="bgpicture" />
      </div>
      <h1 className="name">{username || "Name"}</h1>
      <h2 className="email">{email || "xxx@xx.com"}</h2>
      <div className="content-wrapper">
        <div className="link-list">
          <p>History</p>
          <hr />
          <button onClick={() => setActiveModal("hobbies")} className="pp-button">
            Own Hobbies
          </button>
          <hr />
          <button onClick={() => setActiveModal("favourites")} className="pp-button">
            Favourites
          </button>
          <hr />
          <p>Settings</p>
          <hr />
          <button onClick={() => setActiveModal("changePassword")} className="pp-button">
            Change password
          </button>
          <hr />
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="logout-button"
          >
            Log out
          </button>
          <hr />
        </div>
        </div>
        </div>
        <p className="carousel-text">You might also be interested in</p>
      <Carousel></Carousel>
      </div>

      <Navbar />

      {/* Modaalit */}
    {activeModal === "hobbies" && (
    <Modal onClose={closeModal}>
        <OwnHobbiesModal onClose={closeModal} />
    </Modal>
    )}

    {activeModal === "favourites" && (
    <Modal onClose={closeModal}>
        <FavouritesModal onClose={closeModal} />
    </Modal>
    )}

      {activeModal === "changePassword" && (
        <Modal onClose={closeModal}>
          <h2>Change Password</h2>
          <ChangePasswordForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose} // sulje, kun klikkaa taustaa
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // estä taustan sulkeutuminen kun klikataan modaalin sisällä
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ChangePasswordForm({ onClose }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass1, setNewPass1] = useState("");
  const [newPass2, setNewPass2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass1 !== newPass2) {
      alert("Uudet salasanat eivät täsmää!");
      return;
    }
    // TODO: API-kutsu salasanan vaihtoon
    alert("Salasana vaihdettu (demo)");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Old password:
        <input
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        New password:
        <input
          type="password"
          value={newPass1}
          onChange={(e) => setNewPass1(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Confirm new password:
        <input
          type="password"
          value={newPass2}
          onChange={(e) => setNewPass2(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Change Password</button>
    </form>
  );
}
