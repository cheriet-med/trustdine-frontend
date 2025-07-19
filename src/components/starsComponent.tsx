'use client'

import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number; // Rating value (0-5)
  maxRating?: number; // Maximum rating (default 5)
  showText?: boolean; // Whether to show "X/Y" text
  size?: number; // Size of stars
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  showText = true,
  size = 14,
}) => {
  // Validate rating
  const validatedRating = Math.min(Math.max(0, rating), maxRating);
  
  return (
    <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex text-accent">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          
          return (
            <span key={index}>
              {validatedRating >= starValue ? (
                <FaStar size={size} />
              ) : validatedRating >= starValue - 0.5 ? (
                <FaStarHalfAlt size={size} />
              ) : (
                <FaRegStar size={size} />
              )}
            </span>
          );
        })}
      </div>
      
     
    </div>
  );
};

export default StarRating;



/** 
{showText && (
  <span className="ml-1 text-sm text-gray-600">
    {validatedRating}/{maxRating}
  </span>
)} */