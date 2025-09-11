import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { images } from "../assets/assets";

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[500px] bg-[#8fa38a] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#1f241f] text-white p-2 rounded-full hover:bg-[#647a67] transition"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#1f241f] text-white p-2 rounded-full hover:bg-[#647a67] transition"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index
                ? "bg-[#1f241f]"
                : "bg-[#a9c5a0] hover:bg-[#647a67]"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
