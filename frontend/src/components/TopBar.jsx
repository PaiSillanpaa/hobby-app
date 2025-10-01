import { getEmailFromToken } from "../utils/Token";
import "./Topbar.css";

export default function TopBar () {
  const email = getEmailFromToken();
  const displayEmail = email || localStorage.getItem("email") || "guest@example.com";

    return (        
        <div className="topbar">
          <div className="img-wrap">
            <img alt="logo" className="logo-img" src="../assets/logo.png"></img>
          </div>
          <span className="email-span">{displayEmail}</span>
        </div>
    );
}