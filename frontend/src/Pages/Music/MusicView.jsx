import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../Components/Common/Breadcrumb';
import CustomButton from '../../Components/Common/CustomButton';
import { fetchMusicById } from '../../Api/music.api';
import { useAudio } from '../../Context/AudioContext';

export default function MusicView() {
  const { musicId } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playQueue, toggleLike, getLikeState, currentTrack, isPlaying } = useAudio();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMusicById(musicId);
        setTrack(data.music || data);
      } catch (err) {
        setError(err?.response?.data?.message || 'track not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [musicId]);

  if (loading) return <div className="loading-line">GET /getmusic/{musicId}</div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!track) return null;

  const like = getLikeState(track);
  const isActive = (currentTrack?._id || currentTrack?.id) === (track._id || track.id);

  return (
    <div>
      <Breadcrumb segments={['music', 'getmusic', musicId]} />
      <div className="card" style={{ display: 'flex', gap: 20, padding: 20 }}>
        <div className="album-card-art" style={{ width: 180, height: 180, flexShrink: 0 }}>
          {track.coverUri ? <img src={track.coverUri} alt={track.title} /> : <span>♪</span>}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'var(--text-header)', margin: '0 0 6px 0' }}>{track.title}</h2>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 10 }}>
            {track.artist?.username || track.artistName || 'unknown_artist'}
          </div>
          <div style={{ marginBottom: 14 }}>
            {(track.genres || []).map((g) => <span className="tag" key={g} style={{ marginRight: 6 }}>{g}</span>)}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 14 }}>
            {like.likesCount} likes · {track.playsCount ?? 0} plays
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <CustomButton variant="primary" onClick={() => playQueue([track], 0)}>
              {isActive && isPlaying ? '⏸ pause' : '▶ play'}
            </CustomButton>
            <CustomButton active={like.liked} onClick={() => toggleLike(track)}>
              ▲ like ({like.likesCount})
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
