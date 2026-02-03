import { Track } from '../types';
import { generateId } from './helpers';

export async function extractAudioMetadata(file: File): Promise<Track> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      const track: Track = {
        id: generateId(),
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        artist: 'Unknown Artist',
        duration: audio.duration,
        audioUrl: objectUrl,
        isLocal: true,
        uploadedAt: new Date(),
      };

      // Try to extract ID3 tags using the File API
      // Note: Full ID3 parsing would require a library like jsmediatags
      // For now, we'll use basic file info
      
      URL.revokeObjectURL(objectUrl);
      resolve(track);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load audio file'));
    });

    audio.src = objectUrl;
  });
}

// Validate audio file
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
    return { valid: false, error: 'Invalid file type. Supported formats: MP3, WAV, OGG, AAC' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }

  return { valid: true };
}

// Create a blob URL for audio playback
export function createAudioURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}
