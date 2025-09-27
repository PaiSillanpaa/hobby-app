import "./Topbar.css";

export default function TopBar () {
    return (        
        <div className="topbar">
          <div className="img-wrap">
            <img alt="logo" className="logo-img" src="../assets/logo.png"></img>
          </div>
          <span className="email-span">admin@example.com</span>
        </div>
    );
}