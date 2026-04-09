import React, { useState } from "react";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";

const Rating = ({ value, onRatingChange, disabled, className = "" }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  // handle star hover
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  // leave mouse 
  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  // handle click
  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  // generate stars based on rating
  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || selectedRating);
      stars.push(
        <span
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          className={`cursor-pointer ${isFilled ? "text-[var(--accent-gold)]" : "text-[var(--text-secondary)]"} ${disabled ? "cursor-default" : ""}`}
        >
          {isFilled ? <IoIosStar size={20} /> : <IoIosStarOutline size={20} />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={`flex flex-row ${className}`}>
      {generateStars()}
    </div>
  );
};

export default Rating;
