import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Album, Track } from '../types';
import { jamendoAPI } from '../services/jamendoAPI';
import { usePlayer } from '../context/PlayerContext';
import { TrackCard } from '../components/ui/TrackCard';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDuration } from '../utils/helpers';
import './AlbumDetail.css';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlbum = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const [albumData, albumTracks] = await Promise.all([
          jamendoAPI.getAlbum(id),
          jamendoAPI.getAlbumTracks(id),
        ]);
        setAlbum(albumData);
        setTracks(albumTracks);
      } catch (err) {
        console.error('Failed to load album:', err);
        setError('Failed to load album');
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [id]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTracks(tracks, 0);
    }
  };

  const handleTrackClick = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTracks(tracks, index);
    }
  };

  const handleArtistClick = () => {
    if (album?.artistId) {
      navigate(`/artist/${album.artistId}`);
    }
  };

  if (loading) {
    return (
      <div className="album-detail">
        <div className="album-detail-header">
          <Skeleton variant="rect" width={200} height={200} />
          <div className="album-detail-header-info">
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={16} />
          </div>
        </div>
        <div className="album-detail-tracks">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="album-detail-skeleton-track">
              <Skeleton variant="rect" width={40} height={40} />
              <div className="album-detail-skeleton-info">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="album-detail-error">
        <div className="album-detail-error-icon">😔</div>
        <p>{error || 'Album not found'}</p>
        <button onClick={() => navigate(-1)} className="album-detail-back-btn">
          Go Back
        </button>
      </div>
    );
  }

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <div className="album-detail">
      <button className="album-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="album-detail-header">
        <div className="album-detail-cover">
          {album.imageUrl ? (
            <img src={album.imageUrl} alt={album.name} />
          ) : (
            <div className="album-detail-cover-placeholder">💿</div>
          )}
        </div>
        <div className="album-detail-header-info">
          <span className="album-detail-type">Album</span>
          <h1 className="album-detail-title">{album.name}</h1>
          <div className="album-detail-meta">
            <span
              className="album-detail-artist"
              onClick={handleArtistClick}
            >
              {album.artist}
            </span>
            {album.releaseDate && (
              <span className="album-detail-year">
                • {album.releaseDate.slice(0, 4)}
              </span>
            )}
            <span className="album-detail-stats">
              • {tracks.length} tracks • {formatDuration(totalDuration)}
            </span>
          </div>
          <button className="album-detail-play-btn" onClick={handlePlayAll}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
            Play All
          </button>
        </div>
      </div>

      <div className="album-detail-tracks">
        <h2 className="album-detail-section-title">Tracks</h2>
        {tracks.map((track, index) => (
          <div key={track.id} className="album-detail-track">
            <span className="album-detail-track-number">{index + 1}</span>
            <TrackCard
              title={track.title}
              artist={track.artist}
              image={track.imageUrl || album.imageUrl || '/placeholder-album.png'}
              duration={formatDuration(track.duration)}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              onPlay={() => handleTrackClick(track, index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetail;
