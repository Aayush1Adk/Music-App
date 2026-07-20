import axios from 'axios';

// Core Axios instance. Backend base URL is proxied through '/api'
// (see vite.config.js). withCredentials ensures the session cookie
// set by the backend on login/register is sent on every request.
const client = axios.create({
  baseURL: 'https://music-app-ic3l.onrender.com/api',
  withCredentials: true,
});

// Shared listener so AuthContext can react to 401/403 responses
// (e.g. force logout + redirect) without every call site handling it.
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler(status, error?.response?.data);
    }
    return Promise.reject(error);
  }
);

export default client;
