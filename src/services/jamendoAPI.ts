import { Track, Album, Artist, JamendoTrack, JamendoAlbum, JamendoArtist } from '../types';

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || 'YOUR_CLIENT_ID';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to get from cache or fetch
async function cachedFetch<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

// Convert Jamendo track to our Track type
function convertTrack(jamendoTrack: JamendoTrack): Track {
  return {
    id: jamendoTrack.id,
    title: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    artistId: jamendoTrack.artist_id,
    album: jamendoTrack.album_name,
    albumId: jamendoTrack.album_id,
    duration: jamendoTrack.duration,
    audioUrl: jamendoTrack.audio || jamendoTrack.audiodownload,
    imageUrl: jamendoTrack.album_image || jamendoTrack.image,
    isLocal: false,
    isDownloaded: false,
  };
}

// Convert Jamendo album to our Album type
function convertAlbum(jamendoAlbum: JamendoAlbum): Album {
  return {
    id: jamendoAlbum.id,
    name: jamendoAlbum.name,
    artist: jamendoAlbum.artist_name,
    artistId: jamendoAlbum.artist_id,
    releaseDate: jamendoAlbum.releasedate,
    imageUrl: jamendoAlbum.image,
  };
}

// Convert Jamendo artist to our Artist type
function convertArtist(jamendoArtist: JamendoArtist): Artist {
  return {
    id: jamendoArtist.id,
    name: jamendoArtist.name,
    imageUrl: jamendoArtist.image,
  };
}

export const jamendoAPI = {
  // Get featured/popular tracks
  async getFeaturedTracks(limit: number = 20): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Search tracks
  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Get tracks by genre
  async getTracksByGenre(genre: string, limit: number = 20): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(genre)}&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Get new releases
  async getNewReleases(limit: number = 20): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=releasedate_desc&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Get album details
  async getAlbum(albumId: string): Promise<Album> {
    const url = `${JAMENDO_API_BASE}/albums/?client_id=${CLIENT_ID}&format=json&id=${albumId}`;
    const response = await cachedFetch<{ results: JamendoAlbum[] }>(url);
    return convertAlbum(response.results[0]);
  },

  // Get album tracks
  async getAlbumTracks(albumId: string): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&album_id=${albumId}&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Get artist details
  async getArtist(artistId: string): Promise<Artist> {
    const url = `${JAMENDO_API_BASE}/artists/?client_id=${CLIENT_ID}&format=json&id=${artistId}`;
    const response = await cachedFetch<{ results: JamendoArtist[] }>(url);
    return convertArtist(response.results[0]);
  },

  // Get artist tracks
  async getArtistTracks(artistId: string, limit: number = 20): Promise<Track[]> {
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&artist_id=${artistId}&limit=${limit}&include=musicinfo`;
    const response = await cachedFetch<{ results: JamendoTrack[] }>(url);
    return response.results.map(convertTrack);
  },

  // Search albums
  async searchAlbums(query: string, limit: number = 20): Promise<Album[]> {
    const url = `${JAMENDO_API_BASE}/albums/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}`;
    const response = await cachedFetch<{ results: JamendoAlbum[] }>(url);
    return response.results.map(convertAlbum);
  },

  // Search artists
  async searchArtists(query: string, limit: number = 20): Promise<Artist[]> {
    const url = `${JAMENDO_API_BASE}/artists/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}`;
    const response = await cachedFetch<{ results: JamendoArtist[] }>(url);
    return response.results.map(convertArtist);
  },
};
