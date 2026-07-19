import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../Components/Common/Breadcrumb';
import BorderedGrid from '../../Components/Common/BorderedGrid';
import AlbumCoverCard from '../../Components/Music/AlbumCoverCard';
import TrackListItem from '../../Components/Music/TrackListItem';
import { searchCatalog } from '../../Api/music.api';

export default function ResultsView() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState({ musics: [], albums: [], artists: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchCatalog(q);
        setResults({
          musics: data.musics || [],
          albums: data.albums || [],
          artists: data.artists || data.users || [],
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'search request failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  return (
    <div>
      <Breadcrumb segments={['search', `q=${q || '""'}`]} />

      {!q ? (
        <div className="empty-state">
          <div className="glyph">/</div>
          type a query in the top search bar to grep the catalog.
        </div>
      ) : loading ? (
        <div className="loading-line">running query "{q}"</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <>
          <div className="section-heading"><h2>musics ({results.musics.length})</h2></div>
          {results.musics.length === 0 ? (
            <div className="empty-state">no matching musics.</div>
          ) : (
            <div className="card">
              {results.musics.map((t, i) => (
                <TrackListItem key={t._id || t.id} track={t} index={i} queue={results.musics} />
              ))}
            </div>
          )}

          <div className="section-heading"><h2>albums ({results.albums.length})</h2></div>
          {results.albums.length === 0 ? (
            <div className="empty-state">no matching albums.</div>
          ) : (
            <BorderedGrid cols={5}>
              {results.albums.map((a) => <AlbumCoverCard key={a._id || a.id} album={a} />)}
            </BorderedGrid>
          )}

          <div className="section-heading"><h2>artists ({results.artists.length})</h2></div>
          {results.artists.length === 0 ? (
            <div className="empty-state">no matching artists.</div>
          ) : (
            <div className="card">
              {results.artists.map((u) => (
                <div className="track-row" key={u._id || u.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
                  <div className="thumb" />
                  <div className="meta">
                    <div className="title">{u.username}</div>
                    <div className="artist">role: artist</div>
                  </div>
                  <span className="tag">{u.tracksCount ?? 0} tracks</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
