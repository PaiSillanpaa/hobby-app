import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import hobbies from "../data/hobbies.json";
import "./HobbyPage.css";
import star from "../assets/star.png";



export default function HobbyPage() {
  const { title } = useParams();
  const { company } = useParams();
  const hobby = hobbies.find(h => h.title === title && h.company === company);

  return (
    <div className="hobbypage-container">
      <div className="box-container">
        <div className="image-wrapper">
            <img src={`../assets/${hobby.image}`} alt="big-image" className="big-image" />
        </div>
            <h1 className="sport">{hobby.title.toUpperCase()}</h1>
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
      <div>
        <Carousel title="You might also be interested in"></Carousel>
      </div>
      <Navbar></Navbar>
    </div>
  );
}