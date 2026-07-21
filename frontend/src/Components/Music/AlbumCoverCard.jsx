import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlbumCoverCard({ album }) {
  const navigate = useNavigate();
  return (
    <div className="album-card" onClick={() => navigate(`/album/${album._id || album.id}`)}>
      <div className="album-card-art">
        {album.cover ? <img src={album.coverUri} alt={album.title} /> : <span>▦</span>}
      </div>
      <div className="album-card-body">
        <div className="album-card-title">{album.title}</div>
        <div className="album-card-sub">{album.artist?.username || album.artistName || 'Unknown artist'}</div>
      </div>
    </div>
  );
}
