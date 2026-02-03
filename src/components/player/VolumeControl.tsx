import { useRef, useState, useEffect, useCallback } from 'react';
import { VolumeIcon, VolumeMuteIcon } from '../icons';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isMuted = volume === 0;

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(previousVolume);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
    }
  };

  const updateVolume = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e as MouseEvent).clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    onVolumeChange(percentage);
  }, [onVolumeChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updateVolume(e as any);
  }, [updateVolume]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newVolume = volume;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newVolume = Math.max(0, volume - 0.1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newVolume = Math.min(1, volume + 0.1);
        break;
      case 'Home':
        newVolume = 0;
        break;
      case 'End':
        newVolume = 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    onVolumeChange(newVolume);
  };

  // Add/remove global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="volume-control">
      <button
        className="volume-control__mute-btn"
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeMuteIcon size={20} /> : <VolumeIcon size={20} />}
      </button>
      <div
        ref={sliderRef}
        className="volume-control__slider"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="volume-control__progress"
          style={{ width: `${volume * 100}%` }}
        >
          <div className="volume-control__thumb" />
        </div>
      </div>
    </div>
  );
};
