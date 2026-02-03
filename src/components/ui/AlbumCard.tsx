import React from 'react';
import './AlbumCard.css';

interface AlbumCardProps {
  name: string;
  artist: string;
  image: string;
  year?: string | number;
  onClick?: () => void;
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  name,
  artist,
  image,
  year,
  onClick,
  className = '',
}) => {
  return (
    <div className={`album-card ${className}`} onClick={onClick}>
      <div className="album-card-image-container">
        <img src={image} alt={name} className="album-card-image" />
        <button
          className="album-card-play-button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          aria-label="Play album"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
        </button>
      </div>
      <div className="album-card-info">
        <h3 className="album-card-name">{name}</h3>
        <div className="album-card-meta">
          <span className="album-card-artist">{artist}</span>
          {year && <span className="album-card-year">{year}</span>}
        </div>
      </div>
    </div>
  );
};
