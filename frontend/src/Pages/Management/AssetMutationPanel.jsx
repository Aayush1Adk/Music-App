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
      setAlbums(albumItems.filter((a) => !a.artist?._id || a.artist._id === user?._id));
    } catch (err) {
      toast.error('failed to load albums');
    }
    try {
      const musicData = await fetchCatalog({ page: 1, limit: 100, sortBy: 'latest' });
      const musicItems = musicData.items || musicData.musics || musicData.data || [];
      setTracks(musicItems.filter((t) => !t.artist?._id || t.artist._id === user?._id));
    } catch (err) {
      toast.error('failed to load tracks');
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
      toast.success('album title updated');
      setEditingAlbum(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'update failed');
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
      toast.success(`track "${deletingTrack.title}" deleted`);
      setDeletingTrack(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="section-heading"><h2>your albums</h2></div>
      {albums.length === 0 ? (
        <div className="empty-state">no albums to manage yet.</div>
      ) : (
        <div className="card" style={{ marginBottom: 20 }}>
          {albums.map((a) => (
            <div className="track-row" key={a._id || a.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
              <div className="thumb">{a.cover ? <img src={a.cover} alt={a.title} /> : null}</div>
              <div className="meta">
                <div className="title">{a.title}</div>
              </div>
              <div className="actions">
                <CustomButton onClick={() => openEdit(a)}>PUT /updatealbum</CustomButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="danger-zone">
        <h3>delete tracks</h3>
        {tracks.length === 0 ? (
          <div className="empty-state">no owned tracks found.</div>
        ) : (
          tracks.map((t) => (
            <div className="track-row" key={t._id || t.id} style={{ gridTemplateColumns: '40px 1fr auto' }}>
              <div className="thumb">{t.coverUri ? <img src={t.coverUri} alt={t.title} /> : null}</div>
              <div className="meta"><div className="title">{t.title}</div></div>
              <div className="actions">
                <CustomButton variant="danger" onClick={() => setDeletingTrack(t)}>DELETE /deletemusic</CustomButton>
              </div>
            </div>
          ))
        )}
      </div>

      {editingAlbum && (
        <ConfirmModal
          title={`update album :${editingAlbum._id || editingAlbum.id}`}
          confirmLabel="save"
          onCancel={() => setEditingAlbum(null)}
          onConfirm={submitEdit}
          loading={savingTitle}
          message={
            <TextInput
              label="new title"
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
          title={`delete track :${deletingTrack._id || deletingTrack.id}`}
          confirmLabel="permanently delete"
          onCancel={() => setDeletingTrack(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          message={`this will permanently remove "${deletingTrack.title}". this action cannot be undone.`}
        />
      )}
    </div>
  );
}
