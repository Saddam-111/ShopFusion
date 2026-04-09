import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Luxury Collection",
    subtitle: "Discover Premium Quality",
    cta: "Shop Now",
    link: "/products",
    color: "from-art-black via-art-charcoal to-art-black"
  },
  {
    title: "New Arrivals",
    subtitle: "Express Your Style",
    cta: "Explore",
    link: "/products",
    color: "from-art-gold-dark via-art-gold to-art-gold-dark"
  },
  {
    title: "Exclusive Deals",
    subtitle: "Up to 50% Off",
    cta: "Buy Now",
    link: "/products",
    color: "from-art-charcoal via-art-black to-art-charcoal"
  }
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-art-black overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`min-w-full h-full flex items-center justify-center bg-gradient-to-r ${slide.color}`}
          >
            <div className="text-center px-6">
              <h2 className="text-4xl md:text-6xl font-serif text-gradient-gold mb-4">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-art-silver mb-6">
                {slide.subtitle}
              </p>
              <Link to={slide.link}>
                <button className="btn-gold px-8 py-3 rounded-lg">
                  {slide.cta}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-art-charcoal/80 text-art-gold p-2 rounded-full hover:bg-art-gold hover:text-art-black transition"
      >
        <FiChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-art-charcoal/80 text-art-gold p-2 rounded-full hover:bg-art-gold hover:text-art-black transition"
      >
        <FiChevronRight size={24} />
      </button>

      <div className="absolute bottom-5 w-full flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index
                ? "bg-art-gold"
                : "bg-art-silver/50 hover:bg-art-gold"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
