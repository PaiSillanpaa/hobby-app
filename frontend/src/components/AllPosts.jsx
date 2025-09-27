import { useState, useEffect } from "react";
import "./AllPosts.css"
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/get-posts"); // backend endpoint
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        // fallback JSON
        const fallbackData = await import("../data/hobbies.json");
        setPosts(fallbackData.default);
      }
    };
    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setEditData(post);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/update-post/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Update failed");

      setPosts(posts.map(p => (p.id === editData.id ? editData : p)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (postId) => {
    const updatedPost = posts.find(p => p.id === postId);
    updatedPost.status = "deleted";

    try {
      const res = await fetch(`/api/update-post/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
      if (!res.ok) throw new Error("Delete failed");

      setPosts(posts.map(p => (p.id === postId ? updatedPost : p)));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (  
  <div className="admin-layout">
    <TopBar></TopBar>
      <div className="main-area">
        <AdminNavBar></AdminNavBar>

        {/* Content */}
        <div className="content">
          <h1>All Posts</h1>
          <div className="all-posts">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                {editingId === post.id ? (
                  <div className="edit-form">
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                    />
                    <input
                      name="company"
                      value={editData.company}
                      onChange={handleChange}
                    />
                    <input
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                    />
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                    />
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="post-summary" onClick={() => handleEditClick(post)}>
                    <p>{post.company} - {post.location} - {post.title}</p>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}>
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

export default AllPosts;
