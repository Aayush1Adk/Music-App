import React, { useState } from 'react';
import Breadcrumb from '../../Components/Common/Breadcrumb';
import UploadMusicForm from './UploadMusicForm';
import CreateAlbumForm from './CreateAlbumForm';
import AssetMutationPanel from './AssetMutationPanel';

const TABS = [
  { key: 'upload', label: 'upload-track' },
  { key: 'album', label: 'create-album' },
  { key: 'manage', label: 'manage-assets' },
];

export default function ArtistControlPanel() {
  const [tab, setTab] = useState('upload');

  return (
    <div>
      <Breadcrumb segments={['manage', 'artist-control-panel']} />
      <div className="section-heading">
        <h2>artist control panel</h2>
        <span className="see-all">role: artist</span>
      </div>

      <div className="panel-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upload' && <UploadMusicForm />}
      {tab === 'album' && <CreateAlbumForm />}
      {tab === 'manage' && <AssetMutationPanel />}
    </div>
  );
}
