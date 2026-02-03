import { usePlayer } from '../../context/PlayerContext';
import { PlayerControls } from './PlayerControls';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import { ExpandIcon } from '../icons';
import './PlayerBar.css';

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  const handleExpandClick = () => {
    // TODO: Open full-screen player or now playing view
    console.log('Expand player');
  };

  return (
    <div className="player-bar">
      <div className="player-bar__content">
        {/* Track Info */}
        <div className="player-bar__track-info">
          <div className="player-bar__album-art">
            {currentTrack.imageUrl ? (
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                className="player-bar__album-image"
              />
            ) : (
              <div className="player-bar__album-placeholder">
                <span>♪</span>
              </div>
            )}
          </div>
          <div className="player-bar__track-details">
            <div className="player-bar__track-title" title={currentTrack.title}>
              {currentTrack.title}
            </div>
            <div className="player-bar__track-artist" title={currentTrack.artist}>
              {currentTrack.artist}
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="player-bar__center">
          <PlayerControls
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeat={repeat}
            onPlayPause={togglePlay}
            onNext={next}
            onPrevious={previous}
            onShuffleToggle={toggleShuffle}
            onRepeatToggle={toggleRepeat}
          />
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </div>

        {/* Right Controls */}
        <div className="player-bar__right">
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
          <button
            className="player-bar__expand-btn"
            onClick={handleExpandClick}
            aria-label="Expand player"
          >
            <ExpandIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
