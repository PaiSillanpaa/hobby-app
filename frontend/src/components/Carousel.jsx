import { useNavigate } from "react-router-dom";
import Info from "../assets/Info.png"
import "./Carousel.css";

export default function Carousel({ items }) {
  const navigate = useNavigate();

  return (
    <div className="carousel-wrapper">
      <div className="carousel">
        {items.map((item, index) => (
          <div
            key={index}
            className="carousel-box"
            onClick={() => navigate(item.infoLink)}
          >
            <div className="carousel-content">
              <img
                src={item.image}
                alt={item.title}
                className="carousel-image"
              />
              <div className="carousel-footer">
                <span className="carousel-title">{item.title}</span>
                <img src={Info} className="carousel-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
