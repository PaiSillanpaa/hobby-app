import { useState, useEffect } from "react";
import "./AllPosts.css";
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";

export default function Users () {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/get-users"); // backend endpoint
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        // fallback JSON
        const fallbackData = await import("../data/users.json");
        setUsers(fallbackData.default);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditData(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/update-user/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Update failed");

      setUsers(users.map(u => (u.id === editData.id ? editData : u)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (userId) => {
    const updatedUser = users.find(u => u.id === userId);
    updatedUser.status = "deleted";

    try {
      const res = await fetch(`/api/update-user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Delete failed");

      setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-layout">
      <TopBar />
      <div className="main-area">
        <AdminNavBar />

        <div className="content">
          <h1>All Users</h1>
          <div className="all-posts">
            {users.map(user => (
              <div key={user.id} className="post-card">
                {editingId === user.id ? (
                  <div className="edit-form">
                    <input
                      name="name"
                      value={editData.username}
                      onChange={handleChange}
                    />
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                    <input
                      name="role"
                      value={editData.rank}
                      onChange={handleChange}
                    />
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="post-summary" onClick={() => handleEditClick(user)}>
                    <p>{user.rank} - {user.email}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

