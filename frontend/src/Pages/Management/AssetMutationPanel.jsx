import React, { useEffect, useState } from 'react';
import CustomButton from '../../Components/Common/CustomButton';
import ConfirmModal from '../../Components/Common/ConfirmModal';
import TextInput from '../../Components/Common/TextInput';
import { fetchRecentAlbums, fetchCatalog, updateAlbum, deleteMusic } from '../../Api/music.api';
import { useToast } from '../../Context/ToastContext';
import { useAuth } from '../../Context/AuthContext';

export default function AssetMutationPanel() {
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null); // album object
  const [editTitle, setEditTitle] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingTrack, setDeletingTrack] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const loadAssets = async () => {
    try {
      const albumData = await fetchRecentAlbums();
      const albumItems = albumData.items || albumData.albums || albumData.data || [];
      // Only show albums we can positively confirm belong to the signed-in
      // artist. Ownership can't be verified when the artist id is missing,
      // so we exclude rather than default to showing someone else's work.
      setAlbums(albumItems.filter((a) => a.artist?._id && user?._id && a.artist._id === user._id));
    } catch (err) {
      toast.error('Could not load your albums right now.');
    }
    try {
      const musicData = await fetchCatalog({ page: 1, limit: 100, sortBy: 'latest' });
      const musicItems = musicData.items || musicData.musics || musicData.data || [];
      setTracks(musicItems.filter((t) => t.artist?._id && user?._id && t.artist._id === user._id));
    } catch (err) {
      toast.error('Could not load your tracks right now.');
    }
  };

  useEffect(() => { loadAssets(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openEdit = (album) => {
    setEditingAlbum(album);
    setEditTitle(album.title);
  };

  const submitEdit = async () => {
    if (!editingAlbum) return;
    setSavingTitle(true);
    try {
      await updateAlbum(editingAlbum._id || editingAlbum.id, { title: editTitle });
      setAlbums((prev) => prev.map((a) => ((a._id || a.id) === (editingAlbum._id || editingAlbum.id) ? { ...a, title: editTitle } : a)));
      toast.success('Album renamed.');
      setEditingAlbum(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save the new title.');
    } finally {
      setSavingTitle(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingTrack) return;
    setDeleting(true);
    try {
      await deleteMusic(deletingTrack._id || deletingTrack.id);
      setTracks((prev) => prev.filter((t) => (t._id || t.id) !== (deletingTrack._id || deletingTrack.id)));
      toast.success(`"${deletingTrack.title}" was deleted.`);
      setDeletingTrack(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete this track.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="section-heading"><h2>Your albums</h2></div>
      {albums.length === 0 ? (
        <div className="empty-state">You haven't created any albums yet.</div>
      ) : (
        <div className="card" style={{ marginBottom: 20 }}>
          {albums.map((a) => (
            <div className="track-row" key={a._id || a.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
              <div className="thumb">{a.cover ? <img src={a.cover} alt={a.title} /> : null}</div>
              <div className="meta">
                <div className="title">{a.title}</div>
              </div>
              <div className="actions">
                <CustomButton onClick={() => openEdit(a)}>Rename</CustomButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="danger-zone">
        <h3>Delete a track</h3>
        {tracks.length === 0 ? (
          <div className="empty-state">You don't have any tracks to delete.</div>
        ) : (
          tracks.map((t) => (
            <div className="track-row" key={t._id || t.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
              <div className="thumb">{t.coverUri ? <img src={t.coverUri} alt={t.title} /> : null}</div>
              <div className="meta"><div className="title">{t.title}</div></div>
              <div className="actions">
                <CustomButton variant="danger" onClick={() => setDeletingTrack(t)}>Delete</CustomButton>
              </div>
            </div>
          ))
        )}
      </div>

      {editingAlbum && (
        <ConfirmModal
          title={`Rename "${editingAlbum.title}"`}
          confirmLabel="Save"
          onCancel={() => setEditingAlbum(null)}
          onConfirm={submitEdit}
          loading={savingTitle}
          message={
            <TextInput
              label="New title"
              name="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          }
        />
      )}

      {deletingTrack && (
        <ConfirmModal
          title={`Delete "${deletingTrack.title}"?`}
          confirmLabel="Delete permanently"
          onCancel={() => setDeletingTrack(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          message={`This will permanently remove "${deletingTrack.title}". This action cannot be undone.`}
        />
      )}
    </div>
  );
}
