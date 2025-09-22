import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./ProfilePage.css"

export default function ProfilePage () {
  const navigate = useNavigate();

    return (
        <div className="profilepage-container">
            <div className="logo-wrapper">
                <img src="../assets/logo.png" alt="logo" className="logopicture"></img>
            </div>
            <div className="image-wrapper-pp">
                <div className="pp-wrapper">
                    <img src="../assets/profile.png" alt="profilepicture" className="profilepicture"></img>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="name">
                    <p>Name</p>
                    <p>xxx@xxx.com</p>
                </div>
                <div className="link-list">
                    <p>History</p>
                    <hr/>
                    <button onClick={() => navigate("/ownhobbies")} className="pp-button">•  Own Hobbies</button>
                    <hr/>
                    <button onClick={() => navigate("/favourites")} className="pp-button">•  Favourites</button>
                    <hr/>
                    <p>Settings</p>
                    <hr/>
                    <button onClick={() => navigate("/changepassword")} className="pp-button">•  Change password</button>
                    <hr/>
                    <button onClick={() => navigate("/")} className="pp-button">Log out</button>
                    <hr/>
                </div>
            </div>
            <Navbar></Navbar>
        </div>
    )
}