import { useState, useEffect } from "react";
import "./AllPosts.css";
import TopBar from "./TopBar";
import AdminNavBar from "./AdminNavBar";
//const baseurl = "https://hobbly-app.onrender.com";

export default function PostRequests() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/listing/all`); // backend endpoint
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setPosts(data.listings.filter(p => p.status === "inactive"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setEditingId(post._id);
    setEditData(post); // Asetetaan postin tiedot muokattavaksi
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const [, key] = name.split(".");
      // Muutetaan location objekti ja päivitetään sen avaimet
      const updatedLocation = { ...editData.location, [key]: value };

      setEditData({ ...editData, location: updatedLocation });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    const { city, address } = editData.location || {};

    if (!city || !address) {
      alert("Anna sekä kaupunki että osoite");
      return;
    }

    const updatedData = {
      ...editData,
      listingDescription: editData.listingDescription || "",
      listingTitle: editData.listingTitle || "",
      location: { city, address }, // Tämä on nyt objekti
    };

    try {
      const id = editData._id
      const res = await fetch(`/api/listing/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedData.listingTitle, 
          description: updatedData.listingDescription,
          city: updatedData.location.city,
          address: updatedData.location.address}),
      });

      if (!res.ok) throw new Error("Päivitys epäonnistui");

      setPosts(posts.map(p => (p._id === editData._id ? updatedData : p)));
      setEditingId(null); // Suljetaan muokkausnäkymä
    } catch (err) {
      console.error(err);
      alert(err.message || "Päivitys epäonnistui");
    }
  };

  const updateStatus = async (postId, newStatus) => {
    const updatedPost = posts.find(p => p._id === postId);
    updatedPost.status = newStatus;

    try {
      let res;

      if (newStatus === "active") {
        res = await fetch(`/api/listing/status/active`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: updatedPost._id }),
        });
      } else if (newStatus === "deleted") {
        res = await fetch(`/api/listing/status/deleted`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: updatedPost._id }),
        });
      }

      if (!res.ok) throw new Error("Status update failed");

      setPosts(posts.filter(p => p._id !== postId)); // Poistetaan post statusin mukaan
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  return (
    <div className="admin-layout">
      <TopBar />
      <div className="main-area">
        <AdminNavBar />
        <div className="content">
          <h1>Post Requests</h1>
          <div className="all-posts">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                {editingId === post._id ? (
                  <div className="edit-form">
                    <input
                      name="listingTitle"
                      value={editData.listingTitle || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="company"
                      value={editData.company || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="location.city"
                      value={editData.location?.city || ""}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    <input
                      name="location.address"
                      value={editData.location?.address || ""}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <textarea
                      name="listingDescription"
                      value={editData.listingDescription || ""}
                      onChange={handleChange}
                    />
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="post-summary" onClick={() => handleEditClick(post)}>
                    <p>{post.company}</p>
                    <div className="actions">
                      <button
                        id="accept-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(post._id, "active");
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(post._id, "deleted");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
