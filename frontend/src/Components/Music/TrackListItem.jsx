import React from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../Context/AudioContext';

export default function TrackListItem({ track, index, queue, canDelete = false, onDelete }) {
  const { playQueue, currentTrack, isPlaying, toggleLike, getLikeState } = useAudio();
  const isActive = (currentTrack?._id || currentTrack?.id) === (track._id || track.id);
  const like = getLikeState(track);

  return (
    <div className={`track-row ${isActive ? 'active' : ''}`}>
      <div className="idx">{isActive && isPlaying ? '♪' : index + 1}</div>
      <div className="thumb">
        {track.coverUri ? <img src={track.coverUri} alt={track.title} /> : null}
      </div>
      <div className="meta">
        <div className="title">
          <Link to={`/music/${track._id || track.id}`}>{track.title}</Link>
        </div>
        <div className="artist">{track.artist?.username || track.artistName || 'Unknown artist'}</div>
      </div>
      <div className="stat">{like.likesCount} likes</div>
      <div className="stat">{track.playsCount ?? 0} plays</div>
      <div className="actions">
        <button className="btn btn-icon" onClick={() => playQueue(queue || [track], index ?? 0)} title="Play">▶</button>
        <button
          className={`btn btn-icon ${like.liked ? 'active' : ''}`}
          onClick={() => toggleLike(track)}
          title={like.liked ? 'Unlike' : 'Like'}
        >
          ▲
        </button>
        {canDelete && (
          <button className="btn btn-icon btn-danger" onClick={() => onDelete?.(track)} title="Delete">✕</button>
        )}
      </div>
    </div>
  );
}
