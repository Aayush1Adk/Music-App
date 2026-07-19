import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import TextInput from '../../Components/Common/TextInput';
import CustomButton from '../../Components/Common/CustomButton';

export default function LoginView() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login({ identifier, password });
    setLoading(false);
    if (ok) navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card-head">
          <div className="brand">hackstream</div>
          <div className="path">$ ~/auth/login</div>
        </div>
        <div className="auth-card-body">
          {authError && <div className="error-banner">error: {authError}</div>}
          <form onSubmit={onSubmit}>
            <TextInput
              label="username or email"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="octocat or octocat@hackstream.dev"
            />
            <TextInput
              label="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <CustomButton type="submit" variant="primary" loading={loading} className="span-2" style={{ width: '100%' }}>
              $ authenticate
            </CustomButton>
          </form>
          <div className="auth-footer-link">
            no account yet? <Link to="/register">register a new session</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
