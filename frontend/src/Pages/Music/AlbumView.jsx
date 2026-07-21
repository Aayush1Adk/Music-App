import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeading from '../../Components/Common/PageHeading';
import TrackListItem from '../../Components/Music/TrackListItem';
import CustomButton from '../../Components/Common/CustomButton';
import { fetchAlbumById } from '../../Api/music.api';
import { useAudio } from '../../Context/AudioContext';

export default function AlbumView() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playQueue } = useAudio();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAlbumById(albumId);
        setAlbum(data.album || data);
      } catch (err) {
        setError(err?.response?.data?.message || 'This album could not be found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId]);

  if (loading) return <div className="loading-line">Loading album</div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!album) return null;

  const tracks = album.musics || [];

  return (
    <div>
      <PageHeading eyebrow="Album" title={album.title} />
      <div className="card" style={{ display: 'flex', gap: 20, padding: 20, marginBottom: 20 }}>
        <div className="album-card-art" style={{ width: 160, height: 160, flexShrink: 0 }}>
          {album.coverUri ? <img src={album.coverUri} alt={album.title} /> : <span>▦</span>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 10, fontSize: 14 }}>
            {album.artist?.username || album.artistName || 'Unknown artist'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 14 }}>
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
          </div>
          <CustomButton variant="primary" disabled={tracks.length === 0} onClick={() => playQueue(tracks, 0)}>
            ▶ Play album
          </CustomButton>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="empty-state">This album doesn't have any tracks yet.</div>
      ) : (
        <div className="card">
          {tracks.map((t, i) => (
            <TrackListItem key={t._id || t.id} track={t} index={i} queue={tracks} />
          ))}
        </div>
      )}
    </div>
  );
}
