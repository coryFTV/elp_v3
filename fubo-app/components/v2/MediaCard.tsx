import React from 'react';
import { MediaCardProps } from '../shared/MediaCard';

/**
 * V2 implementation of the MediaCard component
 * Displays media items in a grid card format with:
 * - Checkbox for "Select for Export"
 * - LIVE badge for ongoing events
 * - Regional restriction badge
 * - Clickable tags for league and network
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
  isLive,
  isRegionallyRestricted,
  onSelectForExport,
  onGenerateLink,
  selected,
}: MediaCardProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectForExport) {
      onSelectForExport(id, e.target.checked);
    }
  };

  const handleGenerateLink = () => {
    if (onGenerateLink) {
      onGenerateLink(id);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
      {/* Selection checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelectChange}
          className="h-5 w-5 rounded border-gray-300"
        />
      </div>
      
      {/* LIVE badge */}
      {isLive && (
        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          LIVE
        </div>
      )}
      
      {/* Regional restriction badge */}
      {isRegionallyRestricted && (
        <div className="absolute bottom-2 right-2 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          Regional Only
        </div>
      )}
      
      {/* Image */}
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
            {date} • {time} EST
          </p>
        )}
        
        {/* Clickable tags */}
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {league && (
            <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors">
              {league}
            </button>
          )}
          
          {network && (
            <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors">
              {network}
            </button>
          )}
          
          {sport && (
            <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full hover:bg-green-200 transition-colors">
              {sport}
            </button>
          )}
        </div>
        
        {/* Generate Link button */}
        <button
          onClick={handleGenerateLink}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          Generate Link
        </button>
      </div>
    </div>
  );
} 