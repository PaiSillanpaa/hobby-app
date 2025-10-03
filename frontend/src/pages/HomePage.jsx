import Navbar from "../components/NavBar";
import homepage from "../assets/homepage.png";
import "./HomePage.css";
import Search from "../components/Search";
import Carousel from "../components/Carousel";

export default function HomePage() {

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
      <Carousel title="Recent top searched hobbies"></Carousel>
      <Carousel title="New adventure in nature?"></Carousel>
      <Carousel title="Unleash your creativity"></Carousel>
      <Navbar />
    </div>
  );
}
