import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import hobbiesFallback from "../data/hobbies.json";
import "./CategoryPage.css";

export default function CategoryPage() {
  const locationSearch = useLocation().search;
  const params = new URLSearchParams(locationSearch);

  const filterLocation = params.get("area")?.split(",") || [];
  const filterAge = params.get("group")?.split(",") || [];
  const filterCategory = params.get("theme")?.split(",") || [];

  const hasFilters = filterLocation.length || filterAge.length || filterCategory.length;

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

  // Laske paras osuma filtereille
  const bestMatchScores = hobbies.map(h => {
    let score = 0;
    if (filterLocation.some(loc => loc === h.location[0])) score++;
    if (filterAge.some(age => h.age.includes(age))) score++;
    if (filterCategory.some(cat => h.category.includes(cat))) score++;
    return { hobby: h, score };
  });

  bestMatchScores.sort((a, b) => b.score - a.score);
  const mainHobby = bestMatchScores[0]?.hobby || (!hasFilters ? hobbies[0] : null);

  // Karusellit
  const topMatches = bestMatchScores.filter(b => b.score > 0).map(b => b.hobby);
  
  // Yksittäisten filttereiden karusellit
  const carousels = [];
  if (filterLocation.length) {
    filterLocation.forEach(loc => {
      const items = hobbies.filter(h => h.location[0] === loc);
      if (items.length) carousels.push({ title: loc, items });
    });
  }
  if (filterAge.length) {
    filterAge.forEach(age => {
      const items = hobbies.filter(h => h.age.includes(age));
      if (items.length) carousels.push({ title: age, items });
    });
  }
  if (filterCategory.length) {
    filterCategory.forEach(cat => {
      const items = hobbies.filter(h => h.category.includes(cat));
      if (items.length) carousels.push({ title: cat, items });
    });
  }

  // Jos ei filttereitä, fallback 3 karusellia
  if (!hasFilters) {
    carousels.push({ title: "Popular Hobbies", items: hobbies.slice(0,5) });
    carousels.push({ title: "Recommended for You", items: hobbies.slice(5,10) });
    carousels.push({ title: "Try Something New", items: hobbies.slice(10,15) });
  }

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
