import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import hobbiesFallback from "../data/hobbies.json";
import { filterHobbies } from "../utils/FilterHobbies";
import "./CategoryPage.css";

export default function CategoryPage() {
  const locationSearch = useLocation().search;
  const params = new URLSearchParams(locationSearch);

  const filterLocation = params.get("area")?.split(",") || [];
  const filterAge = params.get("group")?.split(",") || [];
  const filterCategory = params.get("theme")?.split(",") || [];

  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const res = await fetch("/api/get-hobbies");
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        setHobbies(data);
      } catch (err) {
        console.error(err);
        setHobbies(hobbiesFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchHobbies();
  }, []);

  if (loading) return <p>Loading...</p>;

  const { mainHobby, topMatches, carousels } = filterHobbies(hobbies, {
    location: filterLocation,
    age: filterAge,
    category: filterCategory,
  });

  return (
    <div className="categorypage-container">
      {mainHobby && (
        <div className="box-container">
          <div className="image-wrapper">
            <img src={`../assets/${mainHobby.image}`} alt="main" className="big-image" />
          </div>
          <h1 className="sport">{mainHobby.category[0].toUpperCase()}</h1>
        </div>
      )}

      {topMatches.length > 0 && <Carousel title="Top Matches" items={topMatches} />}

      {carousels.map((c, i) => (
        <Carousel key={i} title={c.title} items={c.items} />
      ))}

      <Navbar />
    </div>
  );
}
