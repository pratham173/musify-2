import React from 'react';
import './TrackCard.css';

interface TrackCardProps {
  title: string;
  artist: string;
  image: string;
  duration?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  title,
  artist,
  image,
  duration,
  onPlay,
  isPlaying = false,
  className = '',
}) => {
  return (
    <div className={`track-card ${className}`}>
      <div className="track-card-image-container">
        <img src={image} alt={title} className="track-card-image" />
        <button
          className="track-card-play-button"
          onClick={onPlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          )}
        </button>
      </div>
      <div className="track-card-info">
        <h3 className="track-card-title">{title}</h3>
        <div className="track-card-meta">
          <span className="track-card-artist">{artist}</span>
          {duration && <span className="track-card-duration">{duration}</span>}
        </div>
      </div>
    </div>
  );
};
