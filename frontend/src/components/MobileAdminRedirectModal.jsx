import "./MobileAdminRedirectModal.css";

export default function MobileAdminRedirectModal({ onLogout }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Limited access on mobile</h2>
        <p>
          Admin and company accounts can only access admin features on a desktop.
        </p>

        <button onClick={onLogout}>Continue without login</button>
      </div>
    </div>
  );
}
