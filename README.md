# hobby-app

# importit
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./app.css";

# jsx
    <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
            >
              <SwiperSlide>
                <div className="card">Card 1 content</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card">Card 2 content</div>
              </SwiperSlide>
    </Swiper>



# css

.swiper {
  width: 100%;
  max-width: 600px;
  height: 720px;
  margin: 50px auto;
}

.swiper-slide {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center; 
  height: 100%;
}

.card {
  background-color: rgb(66, 66, 66);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
}

.swiper-button-next,
.swiper-button-prev {
  color: var(--accent-color);
  height: 40px;
  width: 40px;
}

.swiper-pagination-bullet {
  background: rgb(117, 117, 117);
  opacity: 0.5;
}

.swiper-pagination-bullet-active {
  opacity: 1;
  background: var(--accent-color);
}
