import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../Components/Common/Breadcrumb';
import BorderedGrid from '../../Components/Common/BorderedGrid';
import AlbumCoverCard from '../../Components/Music/AlbumCoverCard';
import TrackListItem from '../../Components/Music/TrackListItem';
import { fetchRecentAlbums } from '../../Api/music.api';
import useCatalog from './useCatalog';

const SORT_OPTIONS = [
  { value: 'latest', label: 'latest' },
  { value: 'oldest', label: 'oldest' },
  { value: 'popular', label: 'popular' },
  { value: 'least', label: 'least played' },
  { value: 'title_asc', label: 'title A→Z' },
  { value: 'title_desc', label: 'title Z→A' },
];

export default function HomeView() {
  const [albums, setAlbums] = useState([]);
  const [albumsError, setAlbumsError] = useState(null);
  const { tracks, page, setPage, sortBy, setSortBy, totalPages, loading, error } = useCatalog();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRecentAlbums();
        setAlbums(data.items || data.albums || data.data || []);
      } catch (err) {
        setAlbumsError('failed to reach /api/music/getalbum');
      }
    })();
  }, []);

  return (
    <div>
      <Breadcrumb segments={['home']} />

      <div className="section-heading">
        <h2>recent albums</h2>
        <span className="see-all">GET /api/music/getalbum</span>
      </div>
      {albumsError && <div className="error-banner">{albumsError}</div>}
      {albums.length === 0 && !albumsError ? (
        <div className="empty-state">
          <div className="glyph">▦</div>
          no album rollouts yet — artists can publish one from the control panel.
        </div>
      ) : (
        <BorderedGrid cols={6}>
          {albums.map((a) => <AlbumCoverCard key={a._id || a.id} album={a} />)}
        </BorderedGrid>
      )}

      <div className="section-heading">
        <h2>catalog</h2>
        <span className="see-all">GET /api/music</span>
      </div>

      <div className="toolbar">
        <span className="toolbar-label">sortBy:</span>
        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="loading-line">fetching page {page} of catalog</div>
      ) : tracks.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">♪</div>
          catalog is empty for this filter combination.
        </div>
      ) : (
        <div className="card">
          {tracks.map((t, i) => (
            <TrackListItem key={t._id || t.id} track={t} index={i} queue={tracks} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="btn btn-icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ prev</button>
        <span>page {page} / {totalPages}</span>
        <button className="btn btn-icon" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>next ›</button>
      </div>
    </div>
  );
}
