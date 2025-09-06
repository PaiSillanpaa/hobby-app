import Navbar from "../components/NavBar";
import homepage from "../assets/homepage.png"
import "./HomePage.css"
import Search from "../components/Search";
import sailingImg from "../assets/sailing.png";
import paintingImg from "../assets/painting.png";
import basketballImg from "../assets/basketball.png";
import guitarImg from "../assets/guitar.png";
import Carousel from "../components/Carousel";

const carouselItems = [
  { image: sailingImg, title: "Sailing", infoLink: "/info/sailing" },
  { image: paintingImg, title: "Painting", infoLink: "/info/painting" },
  { image: basketballImg, title: "Basketball", infoLink: "/info/basketball" },
  { image: guitarImg, title: "Guitar", infoLink: "/info/guitar" },
];

export default function HomePage() {

  return (
    <div className="homepage-container">
      <div className="box-container">
        <div className="image-wrapper">
            <img src={homepage} alt="big-image" className="big-image" />
        </div>
        <h1 className="image-subtitle">Have you always wanted to try something completely new?</h1>
        <p className="subtitle-subtitle">What could it be?</p>
        <Search></Search>
      </div>
      <div>
        <Carousel items={carouselItems} />
      </div>
      <div>
        <Carousel items={carouselItems} />
      </div>
      <div>
        <Carousel items={carouselItems} />
      </div>
      <Navbar></Navbar>
    </div>
  );
}