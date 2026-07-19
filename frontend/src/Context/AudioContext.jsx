import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { logPlay, likeTrack, dislikeTrack } from '../Api/music.api';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }

  const [queue, setQueue] = useState([]); // array of track objects
  const [queueIndex, setQueueIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [loop, setLoop] = useState(false);
  const [likesById, setLikesById] = useState({}); // { [musicId]: { liked, likesCount } }

  // --- audio element event wiring ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      playNext();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, queue, queueIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrackAt = useCallback((tracks, index) => {
    const track = tracks[index];
    if (!track || !audioRef.current) return;
    setQueue(tracks);
    setQueueIndex(index);
    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl || track.musicFileUrl || track.musicFile || '';
    audioRef.current.play().catch(() => {});
    // Fire-and-forget play tracking; backend throttles to once / 30min.
    // We never let this affect the local audio feed.
    logPlay(track._id || track.id);
  }, []);

  // Start (or replace) a queue and play from a given index. This is the
  // primary entry point used by track lists / album views.
  const playQueue = useCallback((tracks, startIndex = 0) => {
    playTrackAt(tracks, startIndex);
  }, [playTrackAt]);

  const playNext = useCallback(() => {
    setQueueIndex((prevIdx) => {
      const nextIdx = prevIdx + 1;
      if (nextIdx < queue.length) {
        playTrackAt(queue, nextIdx);
        return nextIdx;
      }
      return prevIdx;
    });
  }, [queue, playTrackAt]);

  const playPrev = useCallback(() => {
    setQueueIndex((prevIdx) => {
      const prevIdxTarget = prevIdx - 1;
      if (prevIdxTarget >= 0) {
        playTrackAt(queue, prevIdxTarget);
        return prevIdxTarget;
      }
      return prevIdx;
    });
  }, [queue, playTrackAt]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [currentTrack]);

  const seekTo = useCallback((seconds) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const toggleLoop = useCallback(() => setLoop((l) => !l), []);

  // Optimistic like/dislike toggling against likesCount
  const toggleLike = useCallback(async (track) => {
    const id = track._id || track.id;
    const current = likesById[id] || { liked: false, likesCount: track.likesCount || 0 };
    const nextLiked = !current.liked;
    const optimistic = {
      liked: nextLiked,
      likesCount: current.likesCount + (nextLiked ? 1 : -1),
    };
    setLikesById((prev) => ({ ...prev, [id]: optimistic }));
    try {
      if (nextLiked) {
        await likeTrack(id);
      } else {
        await dislikeTrack(id);
      }
    } catch (err) {
      // Roll back optimistic update on failure
      setLikesById((prev) => ({ ...prev, [id]: current }));
    }
  }, [likesById]);

  const getLikeState = useCallback((track) => {
    const id = track._id || track.id;
    return likesById[id] || { liked: false, likesCount: track.likesCount || 0 };
  }, [likesById]);

  const value = useMemo(() => ({
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    loop,
    setVolume,
    playQueue,
    playNext,
    playPrev,
    togglePlay,
    seekTo,
    toggleLoop,
    toggleLike,
    getLikeState,
  }), [queue, queueIndex, currentTrack, isPlaying, progress, duration, volume, loop,
      playQueue, playNext, playPrev, togglePlay, seekTo, toggleLoop, toggleLike, getLikeState]);

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
