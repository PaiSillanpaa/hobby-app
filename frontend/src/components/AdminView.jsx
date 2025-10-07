import { useState } from "react";
//import MapComponent from "./MapComponent";
import "./AdminView.css";
import "./Form.css";
import AdminNavBar from "./AdminNavBar";
import TopBar from "./TopBar";
const baseurl = "https://hobbly-app.onrender.com";

const AdminView = () => {
  //const [coords, setCoords] = useState([60.1300, 24.9240]); 
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  const [age, setAge] = useState([]);
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", JSON.stringify(category));
    formData.append("age", JSON.stringify(age));
    formData.append("type", type);
    formData.append("company", company);
    formData.append("url", url);
    formData.append("location", JSON.stringify({ city, address }));
    formData.append("description", description);
    if(image) formData.append("image", image);

    try {
      const response = await fetch(`${baseurl}/api/listing/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Tallennus epäonnistui");

      alert("Postaus tallennettu onnistuneesti!");
      setTitle("");
      setCategory([]);
      setAge([]);
      setType("");
      setCompany("");
      setUrl("");
      setCity("");
      setAddress("");
      setDescription("");
      setImage(null);
      //setCoords([60.1300, 24.9240]);
    } catch (err) {
      console.error(err);
      alert("Tallenus epäonnistui");
    }
  };

  return (
    <div className="admin-layout">
      <TopBar></TopBar>
      <div className="main-area">
        <AdminNavBar></AdminNavBar>

        <div className="content">
          <h1>Add a New Hobby</h1>
          <form onSubmit={handleSubmit} className="post-form">
          <small>Hold Ctrl (Windows) / Cmd (Mac) to select multiple options</small>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <select
              multiple
              value={category}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setCategory(selected);
              }}
            >
              <option value="art">Art</option>
              <option value="sport">Sport</option>
              <option value="culture">Culture</option>
              <option value="cooking">Cooking</option>
              <option value="handcraft">Handcraft</option>
              <option value="digital">Digital</option>
            </select>
         
            <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input type="url" placeholder="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />

            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="">Select Type</option>
              <option value="solo">Solo</option>
              <option value="group">Group</option>
            </select>

            <select
              multiple
              value={age}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setAge(selected);
              }}
            >
              <option value="kids">Kids</option>
              <option value="young">Young</option>
              <option value="adults">Adults</option>
              <option value="seniors">Seniors</option>
              <option value="family activity">Family Activity</option>
            </select>
            <input
              type="text"
              placeholder="Address (e.g. Music Street 3)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            {/*<MapComponent location={address} setCoords={setCoords} />*/}
            <button type="submit" className="submit-btn">Add Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
