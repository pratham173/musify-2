import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
    />
  );
};

interface SkeletonTrackProps {
  className?: string;
}

export const SkeletonTrack: React.FC<SkeletonTrackProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton-track ${className}`}>
      <Skeleton variant="rect" width={56} height={56} />
      <div className="skeleton-track-info">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
};

interface SkeletonAlbumProps {
  className?: string;
}

export const SkeletonAlbum: React.FC<SkeletonAlbumProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton-album ${className}`}>
      <Skeleton variant="rect" width="100%" height="auto" style={{ aspectRatio: '1' }} />
      <div className="skeleton-album-info">
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="60%" height={14} />
      </div>
    </div>
  );
};
