import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Playlist, Track } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { TrackCard } from '../components/ui/TrackCard';
import { formatDuration } from '../utils/helpers';
import './PlaylistDetail.css';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, updatePlaylist, removeTrackFromPlaylist } = useLibrary();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const foundPlaylist = playlists.find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setEditedName(foundPlaylist.name);
    }
  }, [id, playlists]);

  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      playTracks(playlist.tracks, 0);
    }
  };

  const handleTrackClick = (track: Track, index: number) => {
    if (!playlist) return;
    
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTracks(playlist.tracks, index);
    }
  };

  const handleRemoveTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (!playlist) return;
    
    if (window.confirm('Remove this track from the playlist?')) {
      await removeTrackFromPlaylist(playlist.id, trackId);
    }
  };

  const handleSaveName = async () => {
    if (!playlist || !editedName.trim()) return;
    
    await updatePlaylist(playlist.id, { name: editedName.trim() });
    setIsEditing(false);
  };

  if (!playlist) {
    return (
      <div className="playlist-detail-error">
        <div className="playlist-detail-error-icon">😔</div>
        <p>Playlist not found</p>
        <button onClick={() => navigate('/library')} className="playlist-detail-back-btn">
          Go to Library
        </button>
      </div>
    );
  }

  const totalDuration = playlist.tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <div className="playlist-detail">
      <button className="playlist-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="playlist-detail-header">
        <div className="playlist-detail-cover">
          {playlist.coverImage ? (
            <img src={playlist.coverImage} alt={playlist.name} />
          ) : (
            <div className="playlist-detail-cover-placeholder">
              <span>🎵</span>
            </div>
          )}
        </div>
        <div className="playlist-detail-header-info">
          <span className="playlist-detail-type">Playlist</span>
          
          {isEditing ? (
            <div className="playlist-detail-edit">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="playlist-detail-edit-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <div className="playlist-detail-edit-actions">
                <button
                  className="playlist-detail-edit-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="playlist-detail-edit-btn playlist-detail-save-btn"
                  onClick={handleSaveName}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <h1 className="playlist-detail-title" onClick={() => setIsEditing(true)}>
              {playlist.name}
              <span className="playlist-detail-edit-icon" title="Edit name">✏️</span>
            </h1>
          )}
          
          {playlist.description && (
            <p className="playlist-detail-description">{playlist.description}</p>
          )}
          
          <span className="playlist-detail-stats">
            {playlist.tracks.length} tracks • {formatDuration(totalDuration)}
          </span>
          
          {playlist.tracks.length > 0 && (
            <button className="playlist-detail-play-btn" onClick={handlePlayAll}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
              Play All
            </button>
          )}
        </div>
      </div>

      <div className="playlist-detail-tracks">
        {playlist.tracks.length === 0 ? (
          <div className="playlist-detail-empty">
            <div className="playlist-detail-empty-icon">🎵</div>
            <p>This playlist is empty</p>
            <span>Add tracks from Browse or Search</span>
          </div>
        ) : (
          <>
            <h2 className="playlist-detail-section-title">Tracks</h2>
            {playlist.tracks.map((track, index) => (
              <div key={track.id} className="playlist-detail-track">
                <span className="playlist-detail-track-number">{index + 1}</span>
                <TrackCard
                  title={track.title}
                  artist={track.artist}
                  image={track.imageUrl || '/placeholder-album.png'}
                  duration={formatDuration(track.duration)}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onPlay={() => handleTrackClick(track, index)}
                />
                <button
                  className="playlist-detail-remove-btn"
                  onClick={(e) => handleRemoveTrack(e, track.id)}
                  title="Remove from playlist"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
