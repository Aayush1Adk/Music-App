import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import TextInput from '../../Components/Common/TextInput';
import CustomButton from '../../Components/Common/CustomButton';

export default function RegistrationView() {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, authError } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register({ username, email, password, role });
    setLoading(false);
    if (ok) navigate('/', { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card-head">
          <div className="brand">Dhuwaani</div>
          <div className="path">Create your account</div>
        </div>
        <div className="auth-card-body">
          {authError && <div className="error-banner">{authError}</div>}

          <div className="role-switch">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>
              Listener
            </button>
            <button type="button" className={role === 'artist' ? 'active' : ''} onClick={() => setRole('artist')}>
              Artist
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <TextInput
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Pick a username"
            />
            <TextInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <TextInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              hint="8 characters minimum"
            />
            <CustomButton type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
              Create {role === 'artist' ? 'artist' : ''} account
            </CustomButton>
          </form>
          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
