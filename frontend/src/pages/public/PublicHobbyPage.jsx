import { useParams } from "react-router-dom";
import Navbar from "./PublicNavBar";
import Carousel from "./PublicCarousel";
import "../HobbyPage.css";
import star from "../../assets/star.png";
import { useEffect, useState } from "react";
const baseurl = "https://hobbly-app.onrender.com";

export default function HobbyPage() {
  const [hobbies, setHobbies] = useState([]);
  const [hobby, setHobby] = useState(null);
  const { title } = useParams();
  const { company } = useParams();

  // Haetaan kaikki harrastukset
  useEffect(() => {
    const getHobbies = async () => {
      try {
        const hobbiesResponse = await fetch(`${baseurl}/api/listing/active2`);
        
        if (!hobbiesResponse.ok) {
          throw new Error(`API-vastausvirhe: ${hobbiesResponse.status}`);
        }

        const hobbiesData = await hobbiesResponse.json();        
        setHobbies(hobbiesData);
      } catch (err) {
        console.error("Error while fetching hobbies:", err);
      }
    };

    getHobbies();
  }, []);

  useEffect(() => {
    const getHobby = () => {
      if (hobbies.length === 0) return;
      const hobbyMatch = hobbies.find(h => h.listingTitle === title && h.company === company);
      setHobby(hobbyMatch);
    };

    getHobby();
  }, [hobbies, company, title]);

  if (!hobby) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hobbypage-container">
      <div className="box-container">
        <div className="image-wrapper">
          {hobby.category && (
            <img src={`../assets/${hobby.category[0]}.png`} alt="big-image" className="big-image" />
          )}
        </div>
        <h1 className="sport">{hobby.listingTitle.toUpperCase()}</h1>
        <h2 className="organization-name">{hobby.company}</h2>
        <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat mollis metus. Curabitur porta posuere libero mattis tempus. Suspendisse quis tortor a lorem dapibus hendrerit. Pellentesque vitae metus molestie turpis lobortis ornare. Sed porta diam in tellus sodales ullamcorper. Vestibulum vehicula porta aliquet. Integer nec hendrerit lectus.</p>
        <div className="s-box">
          <h3 className="s-title">Contacts</h3>
          <p className="s-text">Vestibulum vehicula porta aliquet integer nec hendrerit lectus.</p>
          <p className="url">{hobby.url}</p>
        </div>
        <div className="s-box">
          <h3 className="s-title">References</h3>
          <p className="s-text-green">Vestibulum vehicula porta aliquet integer nec hendrerit lectus.</p>
          <div className="stars-wrapper">
            <img src={star} alt="star" className="star"/>
            <img src={star} alt="star" className="star"/>
            <img src={star} alt="star" className="star"/>
          </div>
        </div>
        <div className="s-box">
          <h3 className="s-title">References</h3>
          <p className="s-text-green">Vestibulum vehicula porta aliquet integer nec hendrerit lectus.</p>
          <div className="stars-wrapper">
            <img src={star} alt="star" className="star"/>
            <img src={star} alt="star" className="star"/>
            <img src={star} alt="star" className="star"/>
          </div>
        </div>
      </div>
      <div className="carousel-bottom">
        <Carousel title="You might also be interested in" />
      </div>
      <Navbar />
    </div>
  );
}
