import { useCallback, useEffect, useState } from 'react';
import { fetchCatalog } from '../../Api/music.api';

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
      setTracks(data.items || data.musics || data.data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'failed to reach /api/music');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy]);

  useEffect(() => { load(); }, [load]);

  return { tracks, page, setPage, sortBy, setSortBy, totalPages, loading, error, reload: load };
}
