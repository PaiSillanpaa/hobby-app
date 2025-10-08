import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import FavouritesModal from "../components/FavouritesModal";
import Carousel from "../components/Carousel";
import { fetchUsername, fetchUserEmail, deleteCookie } from "../utils/UserData";
//import { getUserIdFromToken, getUsernameFromToken, getEmailFromToken } from "../utils/Token";
import "./ProfilePage.css";
//const baseurl = "https://hobbly-app.onrender.com";

export default function ProfilePage() {
  const navigate = useNavigate();

  ////const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        //const id = await fetchUserId();
        const name = await fetchUsername();
        const mail = await fetchUserEmail();
        //setUserId(id);
        setUsername(name);
        setEmail(mail);
      } catch (err) {
        console.error("Virhe backend-haussa, haetaan tokenista:", err);
        // const tokenId = getUserIdFromToken();
        // const tokenName = getUsernameFromToken();
        // const tokenEmail = getEmailFromToken();
        // if (tokenId) setUserId(tokenId);
        // if (tokenName) setUsername(tokenName);
        // if (tokenEmail) setEmail(tokenEmail);
      }
    }

    loadUserData();
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="profilepage-container">
      <div className="everything-wrapper">
        <div className="another-w">
          <div className="image-wrapper-pp">
            <img src="/assets/culture.png" alt="instruments" className="bgpicture" />
          </div>
          <h1 className="name">{username || "Name"}</h1>
          <h2 className="email">{email || "xxx@xx.com"}</h2>

          <div className="content-wrapper">
            <div className="link-list">
              <p>History</p>
              <hr />
              <button
                className="pp-button"
                onClick={() => setActiveModal("favourites")}
              >
                Favourites
              </button>
              <hr />
              <p>Settings</p>
              <hr />
              <button
                className="pp-button"
                onClick={() => setActiveModal("changePassword")}
              >
                Change password
              </button>
              <hr />
              <button
                className="logout-button"
                onClick={() => {
                  deleteCookie();
                  navigate("/");
                }}
              >
                Log out
              </button>
              <hr />
            </div>
          </div>
        </div>
        <Carousel title="You might also be interested in" />
      </div>

      <Navbar />

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ChangePasswordForm({ onClose }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass1, setNewPass1] = useState("");
  const [newPass2, setNewPass2] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass1 !== newPass2) {
      alert("Uudet salasanat eivät täsmää!");
      return;
    }
    try {
      const res = await fetch(`/api/user/change-password`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ currentPassword: oldPass, newPassword1: newPass1, newPassword2: newPass2 }),
      });

      if (!res.ok) throw new Error("Salasanan vaihto epäonnistui");

      alert("Salasana vaihdettu!");
      onClose();
    } catch (err) {
      alert(err.message);
    }
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

      <label>
        New password:
        <input
          type="password"
          value={newPass1}
          onChange={(e) => setNewPass1(e.target.value)}
          required
        />
      </label>

      <label>
        Confirm new password:
        <input
          type="password"
          value={newPass2}
          onChange={(e) => setNewPass2(e.target.value)}
          required
        />
      </label>

      <button type="submit">Change Password</button>
    </form>
  );
} 
