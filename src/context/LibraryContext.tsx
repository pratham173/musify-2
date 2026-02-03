import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Track, Playlist } from '../types';
import { indexedDBService } from '../services/indexedDB';
import { generateId } from '../utils/helpers';
import { extractAudioMetadata, validateAudioFile } from '../utils/audio';
import { downloadFile } from '../utils/helpers';

interface LibraryContextType {
  playlists: Playlist[];
  uploadedTracks: Track[];
  downloadedTracks: Track[];
  createPlaylist: (name: string, description?: string) => Promise<Playlist>;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  reorderPlaylistTracks: (playlistId: string, tracks: Track[]) => Promise<void>;
  uploadTrack: (file: File) => Promise<Track>;
  deleteUploadedTrack: (trackId: string) => Promise<void>;
  downloadTrack: (track: Track, onProgress?: (progress: number) => void) => Promise<void>;
  deleteDownloadedTrack: (trackId: string) => Promise<void>;
  isTrackDownloaded: (trackId: string) => boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);

  // Load library on mount
  useEffect(() => {
    refreshLibrary();
  }, []);

  const refreshLibrary = async () => {
    try {
      const [loadedPlaylists, loadedUploads, loadedDownloads] = await Promise.all([
        indexedDBService.getAllPlaylists(),
        indexedDBService.getAllUploadedTracks(),
        indexedDBService.getAllDownloadedTracks(),
      ]);

      setPlaylists(loadedPlaylists);
      setUploadedTracks(loadedUploads);
      setDownloadedTracks(loadedDownloads);
    } catch (error) {
      console.error('Failed to load library:', error);
    }
  };

  const createPlaylist = async (name: string, description?: string): Promise<Playlist> => {
    const playlist: Playlist = {
      id: generateId(),
      name,
      description,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await indexedDBService.savePlaylist(playlist);
    setPlaylists(prev => [...prev, playlist]);
    return playlist;
  };

  const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>): Promise<void> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      ...updates,
      updatedAt: new Date(),
    };

    await indexedDBService.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const deletePlaylist = async (playlistId: string): Promise<void> => {
    await indexedDBService.deletePlaylist(playlistId);
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const addTrackToPlaylist = async (playlistId: string, track: Track): Promise<void> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Check if track already exists
    if (playlist.tracks.some(t => t.id === track.id)) {
      return;
    }

    const updatedPlaylist = {
      ...playlist,
      tracks: [...playlist.tracks, track],
      updatedAt: new Date(),
    };

    await indexedDBService.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter(t => t.id !== trackId),
      updatedAt: new Date(),
    };

    await indexedDBService.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const reorderPlaylistTracks = async (playlistId: string, tracks: Track[]): Promise<void> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks,
      updatedAt: new Date(),
    };

    await indexedDBService.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const uploadTrack = async (file: File): Promise<Track> => {
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const track = await extractAudioMetadata(file);
    const blob = new Blob([file], { type: file.type });

    await indexedDBService.saveUploadedTrack(track, blob);
    
    // Create object URL for playback
    const objectUrl = URL.createObjectURL(blob);
    const trackWithUrl = { ...track, audioUrl: objectUrl };
    
    setUploadedTracks(prev => [...prev, trackWithUrl]);
    return trackWithUrl;
  };

  const deleteUploadedTrack = async (trackId: string): Promise<void> => {
    await indexedDBService.deleteUploadedTrack(trackId);
    setUploadedTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const downloadTrack = async (track: Track, onProgress?: (progress: number) => void): Promise<void> => {
    try {
      const blob = await downloadFile(track.audioUrl, onProgress);
      
      const downloadedTrack = {
        ...track,
        isDownloaded: true,
        downloadedAt: new Date(),
      };

      await indexedDBService.saveDownloadedTrack(downloadedTrack, blob);
      setDownloadedTracks(prev => [...prev, downloadedTrack]);
    } catch (error) {
      console.error('Failed to download track:', error);
      throw error;
    }
  };

  const deleteDownloadedTrack = async (trackId: string): Promise<void> => {
    await indexedDBService.deleteDownloadedTrack(trackId);
    setDownloadedTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const isTrackDownloaded = (trackId: string): boolean => {
    return downloadedTracks.some(t => t.id === trackId);
  };

  return (
    <LibraryContext.Provider
      value={{
        playlists,
        uploadedTracks,
        downloadedTracks,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        reorderPlaylistTracks,
        uploadTrack,
        deleteUploadedTrack,
        downloadTrack,
        deleteDownloadedTrack,
        isTrackDownloaded,
        refreshLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
