import React from 'react';
import { useAudio } from '../../Context/AudioContext';

function formatTime(sec = 0) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function FixedBottomPlayer() {
  const {
    currentTrack, isPlaying, progress, duration, volume, loop,
    setVolume, togglePlay, seekTo, toggleLoop, playNext, playPrev,
    toggleLike, getLikeState,
  } = useAudio();

  if (!currentTrack) {
    return (
      <div className="bottom-player">
        <div className="player-track-meta">
          <div className="thumb" />
          <div className="info">
            <div className="title" style={{ color: 'var(--text-muted)' }}>no track loaded</div>
            <div className="artist">idle // queue: []</div>
          </div>
        </div>
        <div className="player-center">
          <div className="player-controls">
            <button className="btn btn-icon" disabled>⏮</button>
            <button className="btn btn-icon" disabled>▶</button>
            <button className="btn btn-icon" disabled>⏭</button>
          </div>
        </div>
        <div className="player-right" />
      </div>
    );
  }

  const likeState = getLikeState(currentTrack);

  return (
    <div className="bottom-player">
      <div className="player-track-meta">
        <div className="thumb">
          {currentTrack.coverUri ? (
            <img src={currentTrack.coverUri} alt={currentTrack.title} />
          ) : null}
        </div>
        <div className="info">
          <div className="title">{currentTrack.title}</div>
          <div className="artist">{currentTrack.artist?.username || currentTrack.artistName || 'unknown_artist'}</div>
        </div>
        <div className="like-controls">
          <button
            className={`btn btn-icon ${likeState.liked ? 'active' : ''}`}
            onClick={() => toggleLike(currentTrack)}
            title="like"
          >
            ▲ {likeState.likesCount}
          </button>
          <button
            className="btn btn-icon"
            onClick={() => toggleLike({ ...currentTrack, likesCount: likeState.likesCount })}
            title="dislike"
            style={{ display: likeState.liked ? 'inline-flex' : 'none' }}
          >
            ▼
          </button>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="btn btn-icon" onClick={playPrev} title="previous">⏮</button>
          <button className="btn btn-icon btn-primary" onClick={togglePlay} title="play/pause">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="btn btn-icon" onClick={playNext} title="next">⏭</button>
          <button className={`btn btn-icon ${loop ? 'active' : ''}`} onClick={toggleLoop} title="loop">
            ↻
          </button>
        </div>
        <div className="player-scrub">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>vol</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
