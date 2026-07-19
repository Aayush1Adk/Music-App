import React, { useState } from 'react';
import TextInput from '../../Components/Common/TextInput';
import CustomButton from '../../Components/Common/CustomButton';
import { uploadTrack } from '../../Api/music.api';
import { useToast } from '../../Context/ToastContext';

export default function UploadMusicForm() {
  const [title, setTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState([]);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const addGenre = (e) => {
    e.preventDefault();
    const g = genreInput.trim();
    if (g && !genres.includes(g)) setGenres((prev) => [...prev, g]);
    setGenreInput('');
  };

  const removeGenre = (g) => setGenres((prev) => prev.filter((x) => x !== g));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!musicFile) {
      toast.error('musicFile is required');
      return;
    }
    setSubmitting(true);
    setProgress(0);
    try {
      await uploadTrack(
        { musicFile, coverUri, title, genres },
        (evt) => setProgress(Math.round((evt.loaded / evt.total) * 100))
      );
      toast.success(`track "${title}" uploaded`);
      setTitle('');
      setMusicFile(null);
      setCoverUri(null);
      setGenres([]);
      setProgress(0);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'upload failed');
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
          placeholder="track title"
        />
      </div>

      <div className="field">
        <label>musicFile <span className="req">*</span></label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
          disabled={submitting}
          required
        />
        <span className="field-hint">audio binary, sent as multipart field "musicFile"</span>
      </div>

      <div className="field">
        <label>coverUri</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverUri(e.target.files?.[0] || null)}
          disabled={submitting}
        />
        <span className="field-hint">image binary, sent as multipart field "coverUri"</span>
      </div>

      <div className="span-2 field">
        <label>genres</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addGenre(e); }}
            placeholder="type a genre, press enter"
            style={{ flex: 1 }}
          />
          <CustomButton onClick={addGenre}>add</CustomButton>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {genres.map((g) => (
            <span key={g} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeGenre(g)}>
              {g} ✕
            </span>
          ))}
        </div>
        <span className="field-hint">stringified via JSON.stringify(genres) before submit</span>
      </div>

      {submitting && (
        <div className="span-2 loading-line">uploading… {progress}%</div>
      )}

      <div className="span-2">
        <CustomButton type="submit" variant="primary" loading={submitting} disabled={submitting}>
          $ POST /api/music/upload
        </CustomButton>
      </div>
    </form>
  );
}
