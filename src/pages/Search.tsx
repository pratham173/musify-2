import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Track, Album, Artist } from '../types';
import { jamendoAPI } from '../services/jamendoAPI';
import { usePlayer } from '../context/PlayerContext';
import { TrackCard } from '../components/ui/TrackCard';
import { AlbumCard } from '../components/ui/AlbumCard';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDuration, debounce } from '../utils/helpers';
import './Search.css';

type SearchTab = 'tracks' | 'albums' | 'artists';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playTracks, currentTrack, isPlaying, togglePlay } = usePlayer();

  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('tracks');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTracks([]);
      setAlbums([]);
      setArtists([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const [trackResults, albumResults, artistResults] = await Promise.all([
        jamendoAPI.searchTracks(searchQuery, 20),
        jamendoAPI.searchAlbums(searchQuery, 20),
        jamendoAPI.searchArtists(searchQuery, 20),
      ]);
      setTracks(trackResults);
      setAlbums(albumResults);
      setArtists(artistResults);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGenreTracks = useCallback(async (genre: string) => {
    try {
      setLoading(true);
      setSearched(true);
      const trackResults = await jamendoAPI.getTracksByGenre(genre, 30);
      setTracks(trackResults);
      setAlbums([]);
      setArtists([]);
    } catch (err) {
      console.error('Failed to load genre tracks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      performSearch(q);
      if (q) {
        setSearchParams({ q });
      } else {
        setSearchParams({});
      }
    }, 300),
    [performSearch, setSearchParams]
  );

  useEffect(() => {
    if (initialGenre) {
      setQuery(initialGenre);
      loadGenreTracks(initialGenre);
    } else if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleTrackClick = (track: Track, trackList: Track[], index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTracks(trackList, index);
    }
  };

  const handleAlbumClick = (album: Album) => {
    navigate(`/album/${album.id}`);
  };

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artist/${artist.id}`);
  };

  const getResultCount = () => {
    switch (activeTab) {
      case 'tracks':
        return tracks.length;
      case 'albums':
        return albums.length;
      case 'artists':
        return artists.length;
      default:
        return 0;
    }
  };

  return (
    <div className="search">
      {/* Search Input */}
      <div className="search-input-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search for songs, albums, or artists..."
          value={query}
          onChange={handleQueryChange}
          autoFocus
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setSearchParams({});
              setTracks([]);
              setAlbums([]);
              setArtists([]);
              setSearched(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      {searched && (
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Tracks ({tracks.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            Albums ({albums.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Artists ({artists.length})
          </button>
        </div>
      )}

      {/* Results */}
      <div className="search-results">
        {loading ? (
          <div className="search-loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="search-skeleton-item">
                <Skeleton variant="rect" width={56} height={56} />
                <div className="search-skeleton-info">
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="40%" height={14} />
                </div>
              </div>
            ))}
          </div>
        ) : !searched ? (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <p>Search for your favorite music</p>
            <span>Find tracks, albums, and artists</span>
          </div>
        ) : getResultCount() === 0 ? (
          <div className="search-no-results">
            <div className="search-no-results-icon">😔</div>
            <p>No results found for "{query}"</p>
            <span>Try searching with different keywords</span>
          </div>
        ) : (
          <>
            {activeTab === 'tracks' && (
              <div className="search-tracks">
                {tracks.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    title={track.title}
                    artist={track.artist}
                    image={track.imageUrl || '/placeholder-album.png'}
                    duration={formatDuration(track.duration)}
                    isPlaying={currentTrack?.id === track.id && isPlaying}
                    onPlay={() => handleTrackClick(track, tracks, index)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'albums' && (
              <div className="search-albums">
                {albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    name={album.name}
                    artist={album.artist}
                    image={album.imageUrl || '/placeholder-album.png'}
                    year={album.releaseDate?.slice(0, 4)}
                    onClick={() => handleAlbumClick(album)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'artists' && (
              <div className="search-artists">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="search-artist-card"
                    onClick={() => handleArtistClick(artist)}
                  >
                    <div className="search-artist-image">
                      {artist.imageUrl ? (
                        <img src={artist.imageUrl} alt={artist.name} />
                      ) : (
                        <div className="search-artist-placeholder">🎤</div>
                      )}
                    </div>
                    <span className="search-artist-name">{artist.name}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
