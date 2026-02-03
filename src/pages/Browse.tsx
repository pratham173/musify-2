import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Track } from '../types';
import { jamendoAPI } from '../services/jamendoAPI';
import { usePlayer } from '../context/PlayerContext';
import { TrackCard } from '../components/ui/TrackCard';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDuration } from '../utils/helpers';
import './Browse.css';

const GENRES = [
  { id: 'rock', name: 'Rock', color: '#E53935' },
  { id: 'pop', name: 'Pop', color: '#8E24AA' },
  { id: 'electronic', name: 'Electronic', color: '#00ACC1' },
  { id: 'jazz', name: 'Jazz', color: '#FB8C00' },
  { id: 'hiphop', name: 'Hip Hop', color: '#43A047' },
  { id: 'classical', name: 'Classical', color: '#5E35B1' },
  { id: 'ambient', name: 'Ambient', color: '#3949AB' },
  { id: 'country', name: 'Country', color: '#6D4C41' },
];

const Browse: React.FC = () => {
  const navigate = useNavigate();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [featured, releases] = await Promise.all([
          jamendoAPI.getFeaturedTracks(10),
          jamendoAPI.getNewReleases(10),
        ]);
        setFeaturedTracks(featured);
        setNewReleases(releases);
      } catch (err) {
        console.error('Failed to load browse data:', err);
        setError('Failed to load music. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlayTrack = (tracks: Track[], index: number) => {
    playTracks(tracks, index);
  };

  const handleTrackClick = (track: Track, tracks: Track[], index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      handlePlayTrack(tracks, index);
    }
  };

  const handleGenreClick = (genreId: string) => {
    navigate(`/search?genre=${genreId}`);
  };

  if (error) {
    return (
      <div className="browse-error">
        <div className="browse-error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="browse-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="browse">
      {/* Genres Section */}
      <section className="browse-section">
        <h3 className="browse-section-title">Browse by Genre</h3>
        <div className="browse-genres">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              className="browse-genre-card"
              style={{ backgroundColor: genre.color }}
              onClick={() => handleGenreClick(genre.id)}
            >
              <span className="browse-genre-name">{genre.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Tracks Section */}
      <section className="browse-section">
        <h3 className="browse-section-title">Featured Tracks</h3>
        <div className="browse-tracks">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="browse-track-skeleton">
                  <Skeleton variant="rect" width={56} height={56} />
                  <div className="browse-track-skeleton-info">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </div>
                </div>
              ))
            : featuredTracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  title={track.title}
                  artist={track.artist}
                  image={track.imageUrl || '/placeholder-album.png'}
                  duration={formatDuration(track.duration)}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onPlay={() => handleTrackClick(track, featuredTracks, index)}
                />
              ))}
        </div>
      </section>

      {/* New Releases Section */}
      <section className="browse-section">
        <h3 className="browse-section-title">New Releases</h3>
        <div className="browse-tracks">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="browse-track-skeleton">
                  <Skeleton variant="rect" width={56} height={56} />
                  <div className="browse-track-skeleton-info">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </div>
                </div>
              ))
            : newReleases.map((track, index) => (
                <TrackCard
                  key={track.id}
                  title={track.title}
                  artist={track.artist}
                  image={track.imageUrl || '/placeholder-album.png'}
                  duration={formatDuration(track.duration)}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onPlay={() => handleTrackClick(track, newReleases, index)}
                />
              ))}
        </div>
      </section>
    </div>
  );
};

export default Browse;
