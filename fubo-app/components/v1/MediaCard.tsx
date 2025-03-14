import React from 'react';
import { MediaCardProps } from '../shared/MediaCard';

/**
 * V1 implementation of the MediaCard component
 * Displays media items in a card format with an "Add to Cart" button
 */
export default function MediaCard({
  id,
  title,
  image,
  date,
  time,
  league,
  network,
  sport,
  onAddToCart,
}: MediaCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {image && (
        <div className="relative h-40 bg-gray-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        
        {date && time && (
          <p className="text-sm text-gray-600 mb-1">
            {date} • {time}
          </p>
        )}
        
        {league && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">League:</span> {league}
          </p>
        )}
        
        {network && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Network:</span> {network}
          </p>
        )}
        
        {sport && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Sport:</span> {sport}
          </p>
        )}
        
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 