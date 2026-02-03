import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Artist, Track } from '../types';
import { jamendoAPI } from '../services/jamendoAPI';
import { usePlayer } from '../context/PlayerContext';
import { TrackCard } from '../components/ui/TrackCard';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDuration } from '../utils/helpers';
import './ArtistDetail.css';

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const [artistData, artistTracks] = await Promise.all([
          jamendoAPI.getArtist(id),
          jamendoAPI.getArtistTracks(id, 30),
        ]);
        setArtist(artistData);
        setTracks(artistTracks);
      } catch (err) {
        console.error('Failed to load artist:', err);
        setError('Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    loadArtist();
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

  const handleAlbumClick = (albumId?: string) => {
    if (albumId) {
      navigate(`/album/${albumId}`);
    }
  };

  if (loading) {
    return (
      <div className="artist-detail">
        <div className="artist-detail-header">
          <Skeleton variant="circle" width={180} height={180} />
          <div className="artist-detail-header-info">
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="30%" height={20} />
          </div>
        </div>
        <div className="artist-detail-tracks">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="artist-detail-skeleton-track">
              <Skeleton variant="rect" width={56} height={56} />
              <div className="artist-detail-skeleton-info">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="artist-detail-error">
        <div className="artist-detail-error-icon">😔</div>
        <p>{error || 'Artist not found'}</p>
        <button onClick={() => navigate(-1)} className="artist-detail-back-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="artist-detail">
      <button className="artist-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="artist-detail-header">
        <div className="artist-detail-image">
          {artist.imageUrl ? (
            <img src={artist.imageUrl} alt={artist.name} />
          ) : (
            <div className="artist-detail-image-placeholder">🎤</div>
          )}
        </div>
        <div className="artist-detail-header-info">
          <span className="artist-detail-type">Artist</span>
          <h1 className="artist-detail-name">{artist.name}</h1>
          <span className="artist-detail-stats">{tracks.length} tracks</span>
          <button className="artist-detail-play-btn" onClick={handlePlayAll}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
            Play All
          </button>
        </div>
      </div>

      {artist.bio && (
        <div className="artist-detail-bio">
          <h2>About</h2>
          <p>{artist.bio}</p>
        </div>
      )}

      <div className="artist-detail-tracks">
        <h2 className="artist-detail-section-title">Popular Tracks</h2>
        {tracks.map((track, index) => (
          <div key={track.id} className="artist-detail-track">
            <TrackCard
              title={track.title}
              artist={track.album || artist.name}
              image={track.imageUrl || artist.imageUrl || '/placeholder-album.png'}
              duration={formatDuration(track.duration)}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              onPlay={() => handleTrackClick(track, index)}
            />
            {track.albumId && (
              <button
                className="artist-detail-album-link"
                onClick={() => handleAlbumClick(track.albumId)}
                title="Go to album"
              >
                💿
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
