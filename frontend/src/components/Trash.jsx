import { useState, useEffect } from "react";
import "./AllPosts.css";
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";

const Trash = () => {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/get-posts");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setPosts(data.filter(p => p.status === "deleted"));
      } catch (err) {
        console.error(err);
        const fallbackData = await import("../data/hobbies.json");
        setPosts(fallbackData.default.filter(p => p.status === "deleted"));
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

    if (name.startsWith("location.")) {
      const [, key] = name.split(".");
      const updatedLocation = [...editData.location];
      updatedLocation[0] = { ...updatedLocation[0], [key]: value };

      setEditData({ ...editData, location: updatedLocation });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    const city = editData.location?.[0]?.city;
    const address = editData.location?.[0]?.address;

    if (!city || !address) {
      alert("Anna sekä kaupunki että osoite");
      return;
    }

    const fullAddress = `${address}, ${city}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );

      if (!response.ok) throw new Error("Koordinaattien haku epäonnistui");

      const data = await response.json();

      if (data.length === 0) {
        alert("Koordinaatteja ei löytynyt annetulle osoitteelle");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      const updatedLocation = [...(editData.location || [{}])];
      updatedLocation[0] = {
        ...updatedLocation[0],
        coords: [lat, lon],
      };

      const updatedEditData = {
        ...editData,
        location: updatedLocation,
      };

      // Lähetetään backendille päivitetty data
      const res = await fetch(`/api/update-post/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEditData),
      });

      if (!res.ok) throw new Error("Päivitys epäonnistui");

      setPosts(posts.map(p => (p.id === editData.id ? updatedEditData : p)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Päivitys epäonnistui");
    }
  };

  const handleRestore = async (postId) => {
    const updatedPost = posts.find(p => p.id === postId);
    updatedPost.status = "active";

    try {
      const res = await fetch(`/api/update-post/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
      if (!res.ok) throw new Error("Restore failed");

      setPosts(posts.filter(p => p.id !== postId)); // poistetaan trashista
    } catch (err) {
      console.error(err);
      alert("Restore failed");
    }
  };

  const handlePermanentDelete = async (postId) => {
    try {
      const res = await fetch(`/api/delete-post/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Permanent delete failed");

      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error(err);
      alert("Permanent delete failed");
    }
  };

  return (
    <div className="admin-layout">
      <TopBar />
      <div className="main-area">
        <AdminNavBar />
        <div className="content">
          <h1>Trash</h1>
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
                      name="location.city"
                      value={editData.location?.[0]?.city || ""}
                      onChange={handleChange}
                      placeholder="City"
                    />

                    <input
                      name="location.address"
                      value={editData.location?.[0]?.address || ""}
                      onChange={handleChange}
                      placeholder="Address"
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
                  <div
                    className="post-summary"
                    onClick={() => handleEditClick(post)}
                  >
                    <p>{post.company} - {post.title}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRestore(post.id); }}
                    >
                      Restore
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePermanentDelete(post.id); }}
                    >
                      Delete Permanently
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

export default Trash;
