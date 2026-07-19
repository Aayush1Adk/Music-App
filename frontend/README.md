# hackstream — music streaming frontend

A React 18 + Vite SPA blending a YouTube Music layout with a GitHub Dark /
Linux terminal aesthetic, built against the `/api/auth` and `/api/music`
contract described in the project brief.

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
├── index.css               # design tokens (GitHub Dark palette), resets, terminal chrome
├── Api/
│   ├── client.js            # shared axios instance + 401/403 hook
│   ├── auth.api.js          # register / login / logout
│   └── music.api.js         # catalog, search, play/like, upload, album, mutation
├── Components/
│   ├── Common/               # TextInput, CustomButton, TerminalCard, BorderedGrid,
│   │                         # Breadcrumb, ConfirmModal
│   ├── Layout/               # Sidebar, HeaderNavigation, FixedBottomPlayer, RuntimeConsole
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
    ├── Search/                 # ResultsView (musics / albums / artists groups)
    ├── Music/                  # MusicView, AlbumView (single item routes)
    └── Management/             # ArtistControlPanel + upload/album/mutation forms
```

## Notes on backend contract assumptions

- List endpoints (`/api/music`, `/api/music/getalbum`, search) are read
  defensively — the client checks `data.items`, then `.musics`/`.albums`,
  then `.data`, so it degrades gracefully if your backend's exact response
  envelope differs slightly.
- `POST /:musicId/play` failures are swallowed on purpose — the 30-minute
  throttle response should never interrupt playback.
- Uploads (`/music/upload`, `/music/album`) send real `multipart/form-data`
  with `onUploadProgress` wired to a progress readout, and block the
  submit button while in flight.
- Any `401` clears the local session and shows a toast; any `403` shows a
  forbidden toast without clearing session (so a `user` hitting an
  artist-only backend route still sees why the app blocked them).
