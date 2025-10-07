import { useNavigate } from "react-router-dom";
import "./AdminNavBar.css";
import { deleteCookie } from "../utils/UserData";

export default function AdminNavBar () {
  const navigate = useNavigate();

  return (  <div className="admin-navbar">
        <ul className="admin-navbar-links">
          <li className="admin-nav-item" onClick={() => navigate("/admin")}>
            <img src="/assets/dashboard.svg" className="admin-nav-icon" alt="Dashboard" />
            <span className="admin-nav-text">Dashboard</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/activeposts")}>
            <img src="/assets/active.svg" className="admin-nav-icon" alt="Active Posts" />
            <span className="admin-nav-text">Active Posts</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/postrequests")}>
            <img src="/assets/requests.svg" className="admin-nav-icon" alt="Post Requests" />
            <span className="admin-nav-text">Post Requests</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/allposts")}>
            <img src="/assets/all.svg" className="admin-nav-icon" alt="All Posts" />
            <span className="admin-nav-text">All Posts</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/trash")}>
            <img src="/assets/trash.svg" className="admin-nav-icon" alt="Trash" />
            <span className="admin-nav-text">Trash</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/users")}>
            <img src="/assets/users.svg" className="admin-nav-icon" alt="Users" />
            <span className="admin-nav-text">Users</span>
          </li>
          <li className="admin-nav-item" onClick={() => navigate("/admin/settings")}>
            <img src="/assets/settings.svg" className="admin-nav-icon" alt="Settings" />
            <span className="admin-nav-text">Settings</span>
          </li>
        </ul>

        <button className="logout-btn" onClick={() => {
            deleteCookie();
            navigate("/")}}>
          <img src="/assets/logout.svg" className="admin-nav-icon" alt="Logout" />
          <span className="admin-nav-text">Log Out</span>
        </button>
      </div>
  );
}