import React from "react";
import type { Advertisement } from "../../../types/Advertisment";

interface SliderProps {
  advertisements: Advertisement[];
}

const Slider: React.FC<SliderProps> = ({ advertisements }) => {
  return (
    <div id="carouselExampleAutoplaying" className="carousel slide mb-0" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {advertisements.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : "false"}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {advertisements.map((slider, i) => (
          <div key={slider.advertisementId} className={`carousel-item ${i === 0 ? "active" : ""} c-item`}>
            <img
              src={slider.image}
              className="d-block w-100"
              alt={slider.name}
              loading="eager"
              style={{
                objectFit: 'cover',
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;