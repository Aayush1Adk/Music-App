import client from './client';

// GET /api/music?page=&limit=&sortBy=
// sortBy: latest | oldest | popular | least | title_asc | title_desc
export const fetchCatalog = async ({ page = 1, limit = 20, sortBy = 'latest' } = {}) => {
  const { data } = await client.get('/music', {
    params: { page, limit, sortBy },
  });
  return data;
};

// GET /api/music/search?q=
export const searchCatalog = async (q) => {
  const { data } = await client.get('/music/search', { params: { q } });
  return data;
};

// GET /api/music/getmusic/:musicId
export const fetchMusicById = async (musicId) => {
  const { data } = await client.get(`/music/getmusic/${musicId}`);
  return data;
};

// GET /api/music/getalbum/:albumId
export const fetchAlbumById = async (albumId) => {
  const { data } = await client.get(`/music/getalbum/${albumId}`);
  return data;
};

// GET /api/music/getalbum -> 10 most recent album cards (no nested music items)
export const fetchRecentAlbums = async () => {
  const { data } = await client.get('/music/getalbum');
  return data;
};

// POST /api/music/:musicId/play
// Backend throttles this to once per 30 minutes per user/track.
// The frontend logs it silently and never blocks the audio feed on the result.
export const logPlay = async (musicId) => {
  try {
    const { data } = await client.post(`/music/${musicId}/play`);
    return data;
  } catch (err) {
    // Swallow errors here on purpose: playback should never stall
    // waiting on the play-tracking side effect.
    return null;
  }
};

// POST /api/music/:musicId/like
export const likeTrack = async (musicId) => {
  const { data } = await client.post(`/music/${musicId}/like`);
  return data;
};

// DELETE /api/music/:musicId/dislike
export const dislikeTrack = async (musicId) => {
  const { data } = await client.delete(`/music/${musicId}/dislike`);
  return data;
};

// POST /api/music/upload (multipart/form-data, artist only)
// fields: musicFile (audio binary), coverUri (image binary), title, genres (array)
export const uploadTrack = async ({ musicFile, coverUri, title, genres = [] }, onUploadProgress) => {
  const form = new FormData();
  form.append('musicFile', musicFile);
  if (coverUri) form.append('coverUri', coverUri);
  form.append('title', title);
  form.append('genres', JSON.stringify(genres));

  const { data } = await client.post('/music/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return data;
};

// POST /api/music/album (multipart/form-data, artist only)
// fields: cover (image binary), title, musics (array of selected track ids)
export const createAlbum = async ({ cover, title, musics = [] }, onUploadProgress) => {
  const form = new FormData();
  if (cover) form.append('cover', cover);
  form.append('title', title);
  form.append('musics', JSON.stringify(musics));

  const { data } = await client.post('/music/album', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return data;
};

// PUT /api/music/updatealbum/:albumId (artist only)
export const updateAlbum = async (albumId, { title }) => {
  const { data } = await client.put(`/music/updatealbum/${albumId}`, { title });
  return data;
};

// DELETE /api/music/deletemusic/:musicId (artist only)
export const deleteMusic = async (musicId) => {
  const { data } = await client.delete(`/music/deletemusic/${musicId}`);
  return data;
};
