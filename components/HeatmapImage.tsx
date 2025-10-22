
import React from 'react';
import type { HeatmapRegion } from '../types';

interface HeatmapImageProps {
  src: string;
  alt: string;
  heatmapRegion: HeatmapRegion | null;
}

export const HeatmapImage: React.FC<HeatmapImageProps> = ({ src, alt, heatmapRegion }) => {
  return (
    <div className="relative w-full h-auto">
      <img 
        src={src} 
        alt={alt}
        className="rounded-lg shadow-lg w-full h-auto object-cover"
      />
      <div 
        className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: heatmapRegion ? 1 : 0,
        }}
      >
        {heatmapRegion && (
          <div
            className="absolute border-2 border-white/50 rounded-lg"
            style={{
              top: `${heatmapRegion.y}%`,
              left: `${heatmapRegion.x}%`,
              width: `${heatmapRegion.width}%`,
              height: `${heatmapRegion.height}%`,
              backgroundColor: 'rgba(239, 68, 68, 0.2)', // red-500 with 20% opacity
              boxShadow: '0 0 15px 5px rgba(239, 68, 68, 0.6)', // red-500 glow
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};
