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
          <div className="brand">hackstream</div>
          <div className="path">$ ~/auth/register</div>
        </div>
        <div className="auth-card-body">
          {authError && <div className="error-banner">error: {authError}</div>}

          <div className="role-switch">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>
              role: user
            </button>
            <button type="button" className={role === 'artist' ? 'active' : ''} onClick={() => setRole('artist')}>
              role: artist
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <TextInput
              label="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="octocat"
            />
            <TextInput
              label="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="octocat@hackstream.dev"
            />
            <TextInput
              label="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              hint="min 8 characters recommended"
            />
            <CustomButton type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
              $ create-account --role={role}
            </CustomButton>
          </form>
          <div className="auth-footer-link">
            already registered? <Link to="/login">sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
