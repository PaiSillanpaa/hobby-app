import { useState } from "react";
import "./Settings.css";
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";
import { fetchUserId } from "../utils/UserData";

export default function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    const userId = fetchUserId();
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      if (!res.ok) throw new Error("Password change failed");

      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Password change failed.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    const userId = fetchUserId();

    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Account deletion failed");

      alert("Account deleted. Logging out...");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="admin-layout">
      <TopBar />
      <div className="main-area">
        <AdminNavBar />

        <div className="content">
          <h1>Settings</h1>

          <div className="settings-section">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} className="settings-form">
              <input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
          </div>

          <div className="settings-section danger-zone">
            <h2>Danger Zone</h2>
            <button className="delete-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
