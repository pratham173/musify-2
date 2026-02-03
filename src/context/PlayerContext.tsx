import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Track, PlayerState, RepeatMode } from '../types';
import { indexedDBService } from '../services/indexedDB';

interface PlayerContextType extends PlayerState {
  audioRef: React.RefObject<HTMLAudioElement>;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  playTrack: (track: Track) => void;
  playTracks: (tracks: Track[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'off',
  });

  // Load saved volume from IndexedDB
  useEffect(() => {
    const loadVolume = async () => {
      try {
        const savedVolume = await indexedDBService.getSetting('volume');
        if (savedVolume !== undefined) {
          setState(prev => ({ ...prev, volume: savedVolume }));
          if (audioRef.current) {
            audioRef.current.volume = savedVolume;
          }
        }
      } catch (error) {
        console.error('Failed to load volume:', error);
      }
    };

    loadVolume();
  }, []);

  // Update audio element when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    audio.src = state.currentTrack.audioUrl;
    audio.volume = state.volume;

    if (state.isPlaying) {
      audio.play().catch(err => console.error('Playback error:', err));
    }
  }, [state.currentTrack]);

  // Update audio element when playing state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.play().catch(err => console.error('Playback error:', err));
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  // Setup Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !state.currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.currentTrack.title,
      artist: state.currentTrack.artist,
      album: state.currentTrack.album || '',
      artwork: state.currentTrack.imageUrl ? [
        { src: state.currentTrack.imageUrl, sizes: '512x512', type: 'image/jpeg' },
      ] : [],
    });

    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', previous);
    navigator.mediaSession.setActionHandler('nexttrack', next);

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [state.currentTrack]);

  const play = () => {
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const next = () => {
    if (state.queue.length === 0) return;

    let nextIndex: number;

    if (state.shuffle) {
      // Random next track (excluding current)
      const availableIndices = state.queue
        .map((_, i) => i)
        .filter(i => i !== state.currentIndex);
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = (state.currentIndex + 1) % state.queue.length;
    }

    setState(prev => ({
      ...prev,
      currentIndex: nextIndex,
      currentTrack: prev.queue[nextIndex],
      currentTime: 0,
    }));
  };

  const previous = () => {
    if (state.queue.length === 0) return;

    // If more than 3 seconds into the track, restart it
    if (state.currentTime > 3) {
      seekTo(0);
      return;
    }

    const prevIndex = state.currentIndex === 0 
      ? state.queue.length - 1 
      : state.currentIndex - 1;

    setState(prev => ({
      ...prev,
      currentIndex: prevIndex,
      currentTrack: prev.queue[prevIndex],
      currentTime: 0,
    }));
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = async (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }

    setState(prev => ({ ...prev, volume: clampedVolume }));

    // Save to IndexedDB
    try {
      await indexedDBService.saveSetting('volume', clampedVolume);
    } catch (error) {
      console.error('Failed to save volume:', error);
    }
  };

  const toggleShuffle = () => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const toggleRepeat = () => {
    setState(prev => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(prev.repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeat: nextMode };
    });
  };

  const setQueue = (tracks: Track[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
      currentTime: 0,
    }));
  };

  const addToQueue = (track: Track) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const playTrack = (track: Track) => {
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      queue: prev.queue.length === 0 ? [track] : prev.queue,
      currentIndex: prev.queue.findIndex(t => t.id === track.id),
    }));
  };

  const playTracks = (tracks: Track[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
      isPlaying: true,
      currentTime: 0,
    }));
  };

  // Handle audio time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime,
        duration: audioRef.current!.duration || 0,
      }));
    }
  };

  // Handle audio end
  const handleEnded = () => {
    if (state.repeat === 'one') {
      seekTo(0);
      play();
    } else if (state.repeat === 'all' || state.currentIndex < state.queue.length - 1) {
      next();
    } else {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        audioRef,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        setQueue,
        addToQueue,
        playTrack,
        playTracks,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      {children}
    </PlayerContext.Provider>
  );
};
