import { useEffect } from 'react';
import { useAudio } from '../../Context/AudioContext';

// Headless engine component -- renders nothing. Wraps the browser's
// MediaSession API around AudioContext so OS-level media keys / lock
// screen controls stay in sync with the in-app player state.
export default function AudioCoreEngine() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev } = useAudio();

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist?.username || currentTrack.artistName || 'Unknown artist',
      artwork: currentTrack.coverUri ? [{ src: currentTrack.coverUri, sizes: '512x512' }] : [],
    });
    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);
    navigator.mediaSession.setActionHandler('previoustrack', playPrev);
  }, [currentTrack, togglePlay, playNext, playPrev]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  return null;
}
