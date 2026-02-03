// Core track interface
export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  duration: number;
  audioUrl: string;
  imageUrl?: string;
  isLocal?: boolean;
  isDownloaded?: boolean;
  uploadedAt?: Date;
  downloadedAt?: Date;
}

// Playlist interface
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
}

// Album interface
export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId?: string;
  releaseDate?: string;
  imageUrl?: string;
  tracks?: Track[];
}

// Artist interface
export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  accentColor: string;
}

// Player state
export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
}

// Download progress
export interface DownloadProgress {
  trackId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}

// Settings
export interface Settings {
  theme: Theme;
  volume: number;
  quality: 'low' | 'medium' | 'high';
}

// Jamendo API response types
export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  album_name?: string;
  album_id?: string;
  duration: number;
  audio: string;
  audiodownload: string;
  image?: string;
  album_image?: string;
}

export interface JamendoAlbum {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  releasedate?: string;
  image?: string;
}

export interface JamendoArtist {
  id: string;
  name: string;
  image?: string;
}
