# Dhuwaani — music streaming frontend

A React 18 + Vite SPA for a music streaming product, styled in a GitHub
Dark palette with a YouTube-Music-style layout, built against the
`/api/auth` and `/api/music` contract described in the project brief.

## Run it

```bash
npm install
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:4000` (see
`vite.config.js`) — point that at your backend, or change the target.

## Structure

```
src/
├── app.jsx                 # layout shell, routing, global providers
├── index.css               # design tokens, resets, layout + component styles
├── Api/
│   ├── client.js            # shared axios instance + 401/403 hook
│   ├── auth.api.js          # register / login / logout
│   └── music.api.js         # catalog, search, play/like, upload, album, mutation
├── Components/
│   ├── Common/               # TextInput, CustomButton, PageHeading, BorderedGrid, ConfirmModal
│   ├── Layout/               # Sidebar, HeaderNavigation, FixedBottomPlayer
│   └── Music/                # TrackListItem, AlbumCoverCard, AudioCoreEngine
├── Context/
│   ├── AuthContext.jsx        # session state, role gating
│   ├── AudioContext.jsx       # HTMLAudioElement, queue, progress, volume, likes
│   └── ToastContext.jsx       # 401/403 + form feedback toasts
├── Middleware/
│   ├── ProtectedRoute.jsx     # auth gate
│   └── ArtistRoute.jsx        # role === 'artist' gate
└── Pages/
    ├── Auth/                  # LoginView, RegistrationView
    ├── Dashboard/              # HomeView (albums rollout + sortable/paginated catalog)
    ├── Search/                 # ResultsView (tracks / albums / artists groups)
    ├── Music/                  # MusicView, AlbumView (single item routes)
    └── Management/             # ArtistControlPanel + upload/album/mutation forms
```

## Design notes

- Palette and layout follow the original brief's GitHub Dark / YouTube
  Music direction, but all user-facing copy is plain English — no raw
  route paths, HTTP verbs, status codes, or database ids are ever shown
  in the UI (breadcrumbs were replaced with a plain `PageHeading`
  component; error/toast copy never echoes the backend response shape).
- Headings and the brand mark use a **Space Grotesk** display face
  (loaded in `index.html`) paired with the monospace stack used for
  data, forms, and controls — this is the one typographic accent; the
  rest of the UI is deliberately quiet.
- `Pages/Management/AssetMutationPanel.jsx` and `CreateAlbumForm.jsx`
  only show albums/tracks where `artist._id` can be positively matched
  against the signed-in user — if the backend doesn't populate the
  `artist` field, those items are excluded rather than shown to
  everyone by default. Fix your backend's population if "your assets"
  looks emptier than expected.

## Notes on backend contract assumptions

- List endpoints (`/api/music`, `/api/music/getalbum`, search) are read
  defensively — the client checks `data.items`, then `.musics`/`.albums`,
  then `.data`, so it degrades gracefully if your backend's exact response
  envelope differs slightly.
- `sortBy` is sent to the backend **and** re-applied client-side
  (`Pages/Dashboard/useCatalog.js`) as a safety net, so the dropdown
  visibly reorders the list even if the backend ignores or
  mis-implements the parameter.
- `POST /:musicId/play` failures are swallowed on purpose — the 30-minute
  throttle response should never interrupt playback.
- Uploads (`/music/upload`, `/music/album`) send real `multipart/form-data`
  with `onUploadProgress` wired to a progress readout, and block the
  submit button while in flight.
- Any `401` clears the local session and shows a toast; any `403` shows a
  toast without clearing session (so a listener hitting an artist-only
  backend route still sees why the app blocked them).
