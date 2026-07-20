import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeading from '../../Components/Common/PageHeading';
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
        setError(err?.response?.data?.message || 'Search is unavailable right now.');
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  return (
    <div>
      <PageHeading eyebrow="Search" title={q ? `Results for "${q}"` : 'Search'} />

      {!q ? (
        <div className="empty-state">
          <div className="glyph">⌕</div>
          Use the search bar above to find tracks, albums, and artists.
        </div>
      ) : loading ? (
        <div className="loading-line">Searching</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <>
          <div className="section-heading"><h2>Tracks ({results.musics.length})</h2></div>
          {results.musics.length === 0 ? (
            <div className="empty-state">No matching tracks.</div>
          ) : (
            <div className="card">
              {results.musics.map((t, i) => (
                <TrackListItem key={t._id || t.id} track={t} index={i} queue={results.musics} />
              ))}
            </div>
          )}

          <div className="section-heading"><h2>Albums ({results.albums.length})</h2></div>
          {results.albums.length === 0 ? (
            <div className="empty-state">No matching albums.</div>
          ) : (
            <BorderedGrid cols={5}>
              {results.albums.map((a) => <AlbumCoverCard key={a._id || a.id} album={a} />)}
            </BorderedGrid>
          )}

          <div className="section-heading"><h2>Artists ({results.artists.length})</h2></div>
          {results.artists.length === 0 ? (
            <div className="empty-state">No matching artists.</div>
          ) : (
            <div className="card">
              {results.artists.map((u) => (
                <div className="track-row" key={u._id || u.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
                  <div className="thumb" />
                  <div className="meta">
                    <div className="title">{u.username}</div>
                    <div className="artist">Artist</div>
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
