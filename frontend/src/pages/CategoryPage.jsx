import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import hobbiesFallback from "../data/hobbies.json";
import { filterHobbies, createFilterTitle } from "../utils/FilterHobbies";
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

  const filterCount = [filterLocation, filterAge, filterCategory].filter(f => f.length > 0).length;

  const filterTitles = createFilterTitle(filterLocation, filterAge, filterCategory);

  if (filterCount === 0) {
    return (
      <div className="categorypage-container">
        {carousels.length > 0 && carousels[0].items.length > 0 && (
          <div className="box-container">
            <div className="image-wrapper">
              <img src={`../assets/${carousels[0].items[0].image}`} alt="main" className="big-image" />
            </div>
            <h1 className="sport">{carousels[0].title}</h1>
          </div>
        )}

        <Carousel title="Wanna be part of a team?" />
        <Carousel title="Creating your own adventure" />
        <Carousel title="Or something totally else?" />
        <Navbar />
      </div>
    );
  }

  if (filterCount === 1) {
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

        {topMatches.length > 0 && <Carousel title={filterTitles[0]} items={topMatches} />}
        <Carousel title="Wanna be part of a team?" />
        <Carousel title="Creating your own adventure" />
        <Navbar />
      </div>
    );
  }

  if (filterCount >= 2) {
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

        {filterLocation.length > 0 && filterTitles[0] && (
          <Carousel title={filterTitles[0]} items={carousels[0]?.items || []} />
        )}
        {filterAge.length > 0 && filterTitles[1] && (
          <Carousel title={filterTitles[1]} items={carousels[1]?.items || []} />
        )}
        {filterCategory.length > 0 && filterTitles[2] && (
          <Carousel title={filterTitles[2]} items={carousels[2]?.items || []} />
        )}

        <Navbar />
      </div>
    );
  }

  return null;
}
