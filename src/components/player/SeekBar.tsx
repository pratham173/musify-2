import { useRef, useState, useEffect, useCallback } from 'react';
import './SeekBar.css';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SeekBar = ({ currentTime, duration, onSeek }: SeekBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = (e as MouseEvent).clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    setDragTime(time);
  }, [duration]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleSeek(e as any);
  }, [handleSeek]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    handleSeek(e as any);
    onSeek(dragTime);
    setIsDragging(false);
  }, [handleSeek, onSeek, dragTime]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    onSeek(time);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newTime = currentTime;
    
    switch (e.key) {
      case 'ArrowLeft':
        newTime = Math.max(0, currentTime - 5);
        break;
      case 'ArrowRight':
        newTime = Math.min(duration, currentTime + 5);
        break;
      case 'Home':
        newTime = 0;
        break;
      case 'End':
        newTime = duration;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    onSeek(newTime);
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
    <div className="seek-bar">
      <span className="seek-bar__time">{formatTime(displayTime)}</span>
      <div
        ref={progressRef}
        className="seek-bar__track"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="seek-bar__progress" style={{ width: `${progress}%` }}>
          <div className="seek-bar__thumb" />
        </div>
      </div>
      <span className="seek-bar__time">{formatTime(duration)}</span>
    </div>
  );
};
