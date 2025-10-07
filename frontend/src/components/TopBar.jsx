import { getEmailFromToken } from "../utils/Token";
import { useState, useEffect } from "react";
import "./TopBar.css";
import { fetchUserEmail } from "../utils/UserData";

export default function TopBar () {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getEmail = async () => {
      try {
        const fetchedEmail = await fetchUserEmail();
        setEmail(fetchedEmail);
      } catch (err) {
        console.error(err);
        const tokenEmail = getEmailFromToken();
        setEmail(tokenEmail);
      }
    };

    getEmail();
  }, []);

  return (        
    <div className="topbar">
      <div className="img-wrap">
        <img alt="logo" className="logo-img" src="../assets/logo.png" />
      </div>
      <span className="email-span">{email}</span>
    </div>
  );
}
