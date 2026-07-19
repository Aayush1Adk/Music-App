import client from './client';

// POST /api/auth/register
// body: { username, email, password, role: 'user' | 'artist' }
export const registerAccount = async ({ username, email, password, role }) => {
  const { data } = await client.post('/auth/register', {
    username,
    email,
    password,
    role,
  });
  return data;
};

// POST /api/auth/login
// body: { username or email, password }
export const loginSession = async ({ identifier, password }) => {
  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const payload = isEmail
    ? { email: identifier, password }
    : { username: identifier, password };
  const { data } = await client.post('/auth/login', payload);
  return data;
};

// POST /api/auth/logout
export const logoutSession = async () => {
  const { data } = await client.post('/auth/logout');
  return data;
};

// Optional: GET current session user, if backend exposes it.
// Falls back gracefully if the route does not exist.
export const fetchCurrentSession = async () => {
  try {
    const { data } = await client.get('/auth/me');
    return data;
  } catch (err) {
    return null;
  }
};
