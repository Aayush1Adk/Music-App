import React, { useEffect, useState } from 'react';
import TextInput from '../../Components/Common/TextInput';
import CustomButton from '../../Components/Common/CustomButton';
import { createAlbum, fetchCatalog } from '../../Api/music.api';
import { useToast } from '../../Context/ToastContext';
import { useAuth } from '../../Context/AuthContext';

export default function CreateAlbumForm() {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState(null);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCatalog({ page: 1, limit: 100, sortBy: 'latest' });
        const items = data.items || data.musics || data.data || [];
        // Prefer showing only this artist's own uploads when the field is present.
        const own = items.filter((t) => !t.artist?._id || t.artist._id === user?._id);
        setAvailable(own.length ? own : items);
      } catch (err) {
        toast.error('failed to load your tracks for album selection');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTrack = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      toast.error('select at least one track for musics[]');
      return;
    }
    setSubmitting(true);
    setProgress(0);
    try {
      await createAlbum(
        { cover, title, musics: selected },
        (evt) => setProgress(Math.round((evt.loaded / evt.total) * 100))
      );
      toast.success(`album "${title}" created`);
      setTitle('');
      setCover(null);
      setSelected([]);
      setProgress(0);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'album creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <div className="span-2">
        <TextInput
          label="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="album title"
        />
      </div>

      <div className="field">
        <label>cover</label>
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} disabled={submitting} />
        <span className="field-hint">image binary, sent as multipart field "cover"</span>
      </div>

      <div className="span-2 field">
        <label>musics <span className="req">*</span></label>
        <div className="checkbox-list">
          {available.length === 0 ? (
            <div style={{ padding: 10, color: 'var(--text-muted)', fontSize: 12 }}>
              no tracks available — upload a track first.
            </div>
          ) : (
            available.map((t) => (
              <label key={t._id || t.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(t._id || t.id)}
                  onChange={() => toggleTrack(t._id || t.id)}
                />
                {t.title}
              </label>
            ))
          )}
        </div>
        <span className="field-hint">
          selected ids stringified via JSON.stringify(musics) — {selected.length} selected
        </span>
      </div>

      {submitting && <div className="span-2 loading-line">uploading… {progress}%</div>}

      <div className="span-2">
        <CustomButton type="submit" variant="primary" loading={submitting} disabled={submitting}>
          $ POST /api/music/album
        </CustomButton>
      </div>
    </form>
  );
}
