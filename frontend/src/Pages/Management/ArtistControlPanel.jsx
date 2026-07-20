import React, { useState } from 'react';
import PageHeading from '../../Components/Common/PageHeading';
import UploadMusicForm from './UploadMusicForm';
import CreateAlbumForm from './CreateAlbumForm';
import AssetMutationPanel from './AssetMutationPanel';

const TABS = [
  { key: 'upload', label: 'Upload track' },
  { key: 'album', label: 'Create album' },
  { key: 'manage', label: 'Manage assets' },
];

export default function ArtistControlPanel() {
  const [tab, setTab] = useState('upload');

  return (
    <div>
      <PageHeading eyebrow="Artist studio" title="Control panel" />

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
