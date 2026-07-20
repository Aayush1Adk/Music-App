import client from "./client";

// Register
export const registerAccount = async ({
  username,
  email,
  password,
  role,
}) => {
  const { data } = await client.post("/auth/register", {
    username,
    email,
    password,
    role,
  });

  return data;
};

// Login
export const loginSession = async ({ identifier, password }) => {
  const isEmail = /\S+@\S+\.\S+/.test(identifier);

  const payload = isEmail
    ? { email: identifier, password }
    : { username: identifier, password };

  const { data } = await client.post("/auth/login", payload);

  return data;
};

// Logout
export const logoutSession = async () => {
  const { data } = await client.post("/auth/logout");
  return data;
};

// Restore logged-in session after refresh
export const fetchCurrentSession = async () => {
  try {
    const { data } = await client.get("/auth/me");
    return data;
  } catch {
    return null;
  }
};