import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import homepage from "../assets/homepage.png";
import "./HomePage.css";
import Search from "../components/Search";
import Carousel from "../components/Carousel";
import hobbiesFallback from "../data/hobbies.json";
import { filterHobbies } from "../utils/FilterHobbies";

export default function HomePage() {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carousels, setCarousels] = useState([]);
  const [topMatches, setTopMatches] = useState([]);

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

  useEffect(() => {
    if (!loading) {
      const { topMatches, carousels } = filterHobbies(hobbies, {
        location: [],
        age: [],
        category: [],
      });

      setTopMatches(topMatches);
      setCarousels(carousels);
    }
  }, [loading, hobbies]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="homepage-container">
      <div className="box-container">
        <div className="image-wrapper">
          <img src={homepage} alt="big-image" className="big-image" />
        </div>
        <h1 className="image-subtitle">
          Have you always wanted to try something completely new?
        </h1>
        <p className="subtitle-subtitle">What could it be?</p>
        <Search />
      </div>

      {topMatches.length > 0 && <Carousel title="Top Matches" items={topMatches} />}

      {carousels.map((c, i) => (
        <Carousel key={i} title={c.title} items={c.items} />
      ))}

      <Navbar />
    </div>
  );
}
