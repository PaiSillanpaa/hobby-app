import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import hobbies from "../data/hobbies.json";

import "./CategoryPage.css";


export default function CategoryPage() {
  const { title } = useParams();
  const hobby = hobbies.find(h => h.title === title);
  
    return (
    <div className="categorypage-container">
      <div className="box-container">
        <div className="image-wrapper">
            <img src={`../assets/${hobby.image}`} alt="big-image" className="big-image" />
        </div>
            <h1 className="sport">{hobby.category.toUpperCase()}</h1>
      </div>
        <p className="text-above">Wanna be part of the team?</p>
      <div>
        <Carousel></Carousel>
      </div>
      <p className="text-above">Creating your own adventure?</p>
      <div>
        <Carousel></Carousel>
      </div>
      <p className="text-above">Or something totally else?</p>
      <div>
        <Carousel></Carousel>
      </div>
      <Navbar></Navbar>
    </div>
    )
}