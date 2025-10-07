import { useState, useEffect } from "react";
import "./AllPosts.css";
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";
const baseurl = "https://hobbly-app.onrender.com";
export default function Users () {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${baseurl}/api/user/users`); // backend endpoint
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        // fallback JSON
        //const fallbackData = await import("../data/users.json");
        //setUsers(fallbackData.default);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditData(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${baseurl}/api/user/${editData._id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername: editData.username,
          newEmail: editData.email,
          newRank: editData.rank}),
      });
      if (!res.ok) throw new Error("Update failed");

      setUsers(users.map(u => (u.id === editData._id ? editData : u)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${baseurl}/api/user/${userId}/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Delete failed");

      setUsers(users.filter(u => u._id !== userId));    
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
              <div key={user._id} className="post-card">
                {editingId === user._id ? (
                  <div className="edit-form">
                    <input
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                    />
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                    <input
                      name="rank"
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
                        handleDelete(user._id);
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

