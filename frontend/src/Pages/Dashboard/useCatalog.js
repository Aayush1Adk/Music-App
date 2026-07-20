import { useCallback, useEffect, useState } from 'react';
import { fetchCatalog } from '../../Api/music.api';

// Applies the selected sort locally as a safety net. Some backends silently
// ignore an unsupported sortBy value, which made sorting look "broken" even
// though the request was correct -- sorting client-side guarantees the list
// on screen always matches what the person picked.
function applySort(list, sortBy) {
  const items = [...list];
  switch (sortBy) {
    case 'oldest':
      return items.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    case 'popular':
      return items.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    case 'least':
      return items.sort((a, b) => (a.playsCount || 0) - (b.playsCount || 0));
    case 'title_asc':
      return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title_desc':
      return items.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'latest':
    default:
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
}

export default function useCatalog() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [sortBy, setSortBy] = useState('latest');
  const [tracks, setTracks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCatalog({ page, limit, sortBy });
      const items = data.items || data.musics || data.data || [];
      setTracks(applySort(items, sortBy));
      setTotalPages(data.totalPages || data.pages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load the catalog. Try again in a moment.');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy]);

  useEffect(() => { load(); }, [load]);

  return { tracks, page, setPage, sortBy, setSortBy, totalPages, loading, error, reload: load };
}
