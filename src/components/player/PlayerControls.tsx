import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
} from '../icons';
import { RepeatMode } from '../../types';
import './PlayerControls.css';

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  disabled?: boolean;
}

export const PlayerControls = ({
  isPlaying,
  shuffle,
  repeat,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  disabled = false,
}: PlayerControlsProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="player-controls">
      <button
        className={`player-controls__btn player-controls__btn--small ${shuffle ? 'active' : ''}`}
        onClick={onShuffleToggle}
        onKeyDown={(e) => handleKeyDown(e, onShuffleToggle)}
        disabled={disabled}
        aria-label="Toggle shuffle"
        aria-pressed={shuffle}
      >
        <ShuffleIcon size={20} />
      </button>

      <button
        className="player-controls__btn player-controls__btn--small"
        onClick={onPrevious}
        onKeyDown={(e) => handleKeyDown(e, onPrevious)}
        disabled={disabled}
        aria-label="Previous track"
      >
        <SkipBackIcon size={24} />
      </button>

      <button
        className="player-controls__btn player-controls__btn--play"
        onClick={onPlayPause}
        onKeyDown={(e) => handleKeyDown(e, onPlayPause)}
        disabled={disabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
      </button>

      <button
        className="player-controls__btn player-controls__btn--small"
        onClick={onNext}
        onKeyDown={(e) => handleKeyDown(e, onNext)}
        disabled={disabled}
        aria-label="Next track"
      >
        <SkipForwardIcon size={24} />
      </button>

      <button
        className={`player-controls__btn player-controls__btn--small ${repeat !== 'off' ? 'active' : ''}`}
        onClick={onRepeatToggle}
        onKeyDown={(e) => handleKeyDown(e, onRepeatToggle)}
        disabled={disabled}
        aria-label={`Repeat: ${repeat}`}
        aria-pressed={repeat !== 'off'}
      >
        <RepeatIcon size={20} />
        {repeat === 'one' && <span className="player-controls__repeat-badge">1</span>}
      </button>
    </div>
  );
};
