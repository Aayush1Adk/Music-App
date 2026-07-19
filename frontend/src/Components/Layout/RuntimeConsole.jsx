import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../Context/AudioContext';
import { useAuth } from '../../Context/AuthContext';

// Purely cosmetic terminal-vibe widget: mirrors real app state changes
// (auth, playback) into a scrolling mock "runtime log", reinforcing the
// Linux terminal system feel without calling any real logging endpoint.
export default function RuntimeConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([
    { lvl: 'info', text: 'runtime::engine boot sequence complete' },
    { lvl: 'info', text: 'audio-core-engine :: standing by' },
  ]);
  const logRef = useRef(null);
  const { currentTrack, isPlaying } = useAudio();
  const { isAuthenticated, user } = useAuth();

  const push = (lvl, text) => {
    setLines((prev) => [...prev.slice(-49), { lvl, text }]);
  };

  useEffect(() => {
    if (currentTrack) {
      push('info', `audio-core-engine :: loaded track "${currentTrack.title}"`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?._id, currentTrack?.id]);

  useEffect(() => {
    if (!currentTrack) return;
    push('info', isPlaying ? 'playback state -> PLAYING' : 'playback state -> PAUSED');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    push('info', isAuthenticated ? `session::auth resolved user=${user?.username}` : 'session::auth idle (guest)');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines, open]);

  return (
    <div className={`runtime-console ${open ? 'open' : ''}`}>
      <div className="runtime-console-bar" onClick={() => setOpen((o) => !o)}>
        <span className="status-dot" />
        runtime-console :: {lines.length} events {open ? '▾' : '▴'}
      </div>
      {open && (
        <div className="runtime-console-log" ref={logRef}>
          {lines.map((l, i) => (
            <div className="line" key={i}>
              <span className={`lvl-${l.lvl}`}>[{l.lvl}]</span> {l.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
