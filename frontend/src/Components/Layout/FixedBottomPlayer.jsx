import React, { useState } from 'react';
import { useAudio } from '../../Context/AudioContext';
import ChevronIcon from '../Common/ChevronIcon';

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
    toggleLike, getLikeState, queue, queueIndex, playQueue,
  } = useAudio();

  const [expanded, setExpanded] = useState(false);

  if (!currentTrack) {
    return (
      <div className="bottom-player">
        <div className="player-track-meta">
          <div className="thumb" />
          <div className="info">
            <div className="title" style={{ color: 'var(--text-muted)' }}>Nothing playing</div>
            <div className="artist">Pick a track to get started</div>
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
  const nextTrack = queue && queueIndex > -1 ? queue[queueIndex + 1] : null;

  return (
    <>
      {expanded && (
        <div className="now-playing-expanded">
          <div className="now-playing-head">
            <span className="now-playing-eyebrow">Now playing</span>
            <button
              className="btn btn-icon btn-chevron"
              onClick={() => setExpanded(false)}
              title="Collapse"
            >
              <ChevronIcon direction="down" size={16} />
            </button>
          </div>

          <div className="now-playing-body">
            <div className="now-playing-art">
              {currentTrack.coverUri ? (
                <img src={currentTrack.coverUri} alt={currentTrack.title} />
              ) : <span>▦</span>}
            </div>

            <div className="now-playing-title">{currentTrack.title}</div>
            <div className="now-playing-artist">
              {currentTrack.artist?.username || currentTrack.artistName || 'Unknown artist'}
            </div>

            <div className="now-playing-controls">
              <button
                className={`btn btn-icon ${likeState.liked ? 'active' : ''}`}
                onClick={() => toggleLike(currentTrack)}
                title={likeState.liked ? 'Unlike' : 'Like'}
              >
                ▲ {likeState.likesCount}
              </button>
              <button className="btn btn-icon" onClick={playPrev} title="Previous">⏮</button>
              <button className="btn btn-icon btn-primary btn-play-lg" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="btn btn-icon" onClick={playNext} title="Next">⏭</button>
              <button className={`btn btn-icon ${loop ? 'active' : ''}`} onClick={toggleLoop} title="Loop">↻</button>
            </div>

            {nextTrack && (
              <div className="up-next" onClick={() => playQueue(queue, queueIndex + 1)}>
                <div className="up-next-label">Next up</div>
                <div className="up-next-row">
                  <div className="thumb">
                    {nextTrack.coverUri ? <img src={nextTrack.coverUri} alt={nextTrack.title} /> : null}
                  </div>
                  <div className="info">
                    <div className="title">{nextTrack.title}</div>
                    <div className="artist">
                      {nextTrack.artist?.username || nextTrack.artistName || 'Unknown artist'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="now-playing-scrub">
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
      )}

      <div className="bottom-player">
        <div className="player-track-meta">
          <div className="thumb">
            {currentTrack.coverUri ? (
              <img src={currentTrack.coverUri} alt={currentTrack.title} />
            ) : null}
          </div>
          <div className="info">
            <div className="title">{currentTrack.title}</div>
            <div className="artist">{currentTrack.artist?.username || currentTrack.artistName || 'Unknown artist'}</div>
          </div>
          <div className="like-controls">
            <button
              className={`btn btn-icon ${likeState.liked ? 'active' : ''}`}
              onClick={() => toggleLike(currentTrack)}
              title={likeState.liked ? 'Unlike' : 'Like'}
            >
              ▲ {likeState.likesCount}
            </button>
          </div>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className="btn btn-icon" onClick={playPrev} title="Previous">⏮</button>
            <button className="btn btn-icon btn-primary" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="btn btn-icon" onClick={playNext} title="Next">⏭</button>
            <button className={`btn btn-icon ${loop ? 'active' : ''}`} onClick={toggleLoop} title="Loop">
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
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <button
            className="btn btn-icon btn-chevron"
            onClick={() => setExpanded(true)}
            title="Expand player"
          >
            <ChevronIcon direction="up" size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
