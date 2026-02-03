import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';
import { TrackCard } from '../components/ui/TrackCard';
import { formatDuration } from '../utils/helpers';
import './Library.css';

type LibraryTab = 'playlists' | 'uploads' | 'downloads';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const {
    playlists,
    uploadedTracks,
    downloadedTracks,
    createPlaylist,
    deletePlaylist,
    uploadTrack,
    deleteUploadedTrack,
    deleteDownloadedTrack,
  } = useLibrary();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [activeTab, setActiveTab] = useState<LibraryTab>('playlists');
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const playlist = await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowNewPlaylistModal(false);
      navigate(`/playlist/${playlist.id}`);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleDeletePlaylist = async (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(playlistId);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadTrack(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTrackClick = (track: Track, trackList: Track[], index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTracks(trackList, index);
    }
  };

  const handleDeleteUploadedTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this track?')) {
      await deleteUploadedTrack(trackId);
    }
  };

  const handleDeleteDownloadedTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (window.confirm('Remove this downloaded track?')) {
      await deleteDownloadedTrack(trackId);
    }
  };

  return (
    <div className="library">
      {/* Tabs */}
      <div className="library-tabs">
        <button
          className={`library-tab ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists ({playlists.length})
        </button>
        <button
          className={`library-tab ${activeTab === 'uploads' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploads')}
        >
          Uploads ({uploadedTracks.length})
        </button>
        <button
          className={`library-tab ${activeTab === 'downloads' ? 'active' : ''}`}
          onClick={() => setActiveTab('downloads')}
        >
          Downloads ({downloadedTracks.length})
        </button>
      </div>

      {/* Content */}
      <div className="library-content">
        {/* Playlists Tab */}
        {activeTab === 'playlists' && (
          <div className="library-playlists">
            <button
              className="library-create-btn"
              onClick={() => setShowNewPlaylistModal(true)}
            >
              <span className="library-create-icon">+</span>
              Create New Playlist
            </button>

            {playlists.length === 0 ? (
              <div className="library-empty">
                <div className="library-empty-icon">🎵</div>
                <p>No playlists yet</p>
                <span>Create your first playlist to organize your music</span>
              </div>
            ) : (
              <div className="library-playlist-grid">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="library-playlist-card"
                    onClick={() => handlePlaylistClick(playlist.id)}
                  >
                    <div className="library-playlist-cover">
                      {playlist.coverImage ? (
                        <img src={playlist.coverImage} alt={playlist.name} />
                      ) : (
                        <div className="library-playlist-cover-placeholder">
                          <span>🎵</span>
                        </div>
                      )}
                    </div>
                    <div className="library-playlist-info">
                      <h3>{playlist.name}</h3>
                      <span>{playlist.tracks.length} tracks</span>
                    </div>
                    <button
                      className="library-delete-btn"
                      onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                      aria-label="Delete playlist"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Uploads Tab */}
        {activeTab === 'uploads' && (
          <div className="library-uploads">
            <div className="library-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="library-file-input"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="library-upload-label">
                {uploading ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <span className="library-upload-icon">📁</span>
                    <span>Click to upload audio files</span>
                    <span className="library-upload-hint">MP3, WAV, OGG, AAC (max 100MB)</span>
                  </>
                )}
              </label>
            </div>

            {uploadedTracks.length === 0 ? (
              <div className="library-empty">
                <div className="library-empty-icon">📤</div>
                <p>No uploaded tracks</p>
                <span>Upload your own music to listen offline</span>
              </div>
            ) : (
              <div className="library-track-list">
                {uploadedTracks.map((track, index) => (
                  <div key={track.id} className="library-track-item">
                    <TrackCard
                      title={track.title}
                      artist={track.artist}
                      image={track.imageUrl || '/placeholder-album.png'}
                      duration={formatDuration(track.duration)}
                      isPlaying={currentTrack?.id === track.id && isPlaying}
                      onPlay={() => handleTrackClick(track, uploadedTracks, index)}
                    />
                    <button
                      className="library-track-delete"
                      onClick={(e) => handleDeleteUploadedTrack(e, track.id)}
                      aria-label="Delete track"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="library-downloads">
            {downloadedTracks.length === 0 ? (
              <div className="library-empty">
                <div className="library-empty-icon">📥</div>
                <p>No downloaded tracks</p>
                <span>Download tracks to listen offline</span>
              </div>
            ) : (
              <div className="library-track-list">
                {downloadedTracks.map((track, index) => (
                  <div key={track.id} className="library-track-item">
                    <TrackCard
                      title={track.title}
                      artist={track.artist}
                      image={track.imageUrl || '/placeholder-album.png'}
                      duration={formatDuration(track.duration)}
                      isPlaying={currentTrack?.id === track.id && isPlaying}
                      onPlay={() => handleTrackClick(track, downloadedTracks, index)}
                    />
                    <button
                      className="library-track-delete"
                      onClick={(e) => handleDeleteDownloadedTrack(e, track.id)}
                      aria-label="Remove download"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Playlist Modal */}
      {showNewPlaylistModal && (
        <div className="library-modal-overlay" onClick={() => setShowNewPlaylistModal(false)}>
          <div className="library-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Playlist</h3>
            <input
              type="text"
              className="library-modal-input"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              autoFocus
            />
            <div className="library-modal-actions">
              <button
                className="library-modal-btn library-modal-cancel"
                onClick={() => setShowNewPlaylistModal(false)}
              >
                Cancel
              </button>
              <button
                className="library-modal-btn library-modal-confirm"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
