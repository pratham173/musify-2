import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Track, Playlist, Settings } from '../types';

interface MusicFlowDB extends DBSchema {
  tracks: {
    key: string;
    value: {
      track: Track;
      blob: Blob;
      downloadedAt: Date;
    };
    indexes: { 'by-date': Date };
  };
  uploads: {
    key: string;
    value: {
      track: Track;
      blob: Blob;
      uploadedAt: Date;
    };
    indexes: { 'by-date': Date };
  };
  playlists: {
    key: string;
    value: Playlist;
    indexes: { 'by-updated': Date };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'musicflow-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MusicFlowDB> | null = null;

async function getDB(): Promise<IDBPDatabase<MusicFlowDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MusicFlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create tracks store
      if (!db.objectStoreNames.contains('tracks')) {
        const trackStore = db.createObjectStore('tracks', { keyPath: 'track.id' });
        trackStore.createIndex('by-date', 'downloadedAt');
      }

      // Create uploads store
      if (!db.objectStoreNames.contains('uploads')) {
        const uploadStore = db.createObjectStore('uploads', { keyPath: 'track.id' });
        uploadStore.createIndex('by-date', 'uploadedAt');
      }

      // Create playlists store
      if (!db.objectStoreNames.contains('playlists')) {
        const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
        playlistStore.createIndex('by-updated', 'updatedAt');
      }

      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });

  return dbInstance;
}

export const indexedDBService = {
  // Downloaded tracks
  async saveDownloadedTrack(track: Track, blob: Blob): Promise<void> {
    const db = await getDB();
    await db.put('tracks', {
      track: { ...track, isDownloaded: true },
      blob,
      downloadedAt: new Date(),
    });
  },

  async getDownloadedTrack(trackId: string): Promise<{ track: Track; blob: Blob } | null> {
    const db = await getDB();
    const result = await db.get('tracks', trackId);
    return result ? { track: result.track, blob: result.blob } : null;
  },

  async getAllDownloadedTracks(): Promise<Track[]> {
    const db = await getDB();
    const results = await db.getAll('tracks');
    return results.map(r => r.track);
  },

  async deleteDownloadedTrack(trackId: string): Promise<void> {
    const db = await getDB();
    await db.delete('tracks', trackId);
  },

  // Uploaded tracks
  async saveUploadedTrack(track: Track, blob: Blob): Promise<void> {
    const db = await getDB();
    await db.put('uploads', {
      track: { ...track, isLocal: true },
      blob,
      uploadedAt: new Date(),
    });
  },

  async getUploadedTrack(trackId: string): Promise<{ track: Track; blob: Blob } | null> {
    const db = await getDB();
    const result = await db.get('uploads', trackId);
    return result ? { track: result.track, blob: result.blob } : null;
  },

  async getAllUploadedTracks(): Promise<Track[]> {
    const db = await getDB();
    const results = await db.getAll('uploads');
    return results.map(r => r.track);
  },

  async deleteUploadedTrack(trackId: string): Promise<void> {
    const db = await getDB();
    await db.delete('uploads', trackId);
  },

  // Playlists
  async savePlaylist(playlist: Playlist): Promise<void> {
    const db = await getDB();
    await db.put('playlists', playlist);
  },

  async getPlaylist(playlistId: string): Promise<Playlist | null> {
    const db = await getDB();
    const result = await db.get('playlists', playlistId);
    return result || null;
  },

  async getAllPlaylists(): Promise<Playlist[]> {
    const db = await getDB();
    return await db.getAll('playlists');
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    const db = await getDB();
    await db.delete('playlists', playlistId);
  },

  // Settings
  async saveSetting(key: string, value: any): Promise<void> {
    const db = await getDB();
    await db.put('settings', value, key);
  },

  async getSetting(key: string): Promise<any> {
    const db = await getDB();
    return await db.get('settings', key);
  },

  async getAllSettings(): Promise<Settings | null> {
    const db = await getDB();
    const theme = await db.get('settings', 'theme');
    const volume = await db.get('settings', 'volume');
    const quality = await db.get('settings', 'quality');

    if (!theme && !volume && !quality) {
      return null;
    }

    return {
      theme: theme || { mode: 'dark', accentColor: '#007AFF' },
      volume: volume ?? 0.7,
      quality: quality || 'medium',
    };
  },
};
