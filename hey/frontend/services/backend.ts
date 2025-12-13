import { User, SavedTab, SongMetadata } from '../types';

const API_URL = '/api'; // Uses Vite proxy to forward to http://localhost:5000

const SESSION_KEY = 'tabsense_session_token';

// Helper to get auth headers
const getHeaders = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  const token = sessionStr ? JSON.parse(sessionStr).token : '';
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };
};

// --- AUTH SERVICES ---

export const register = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Registration failed');

  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
};

export const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Login failed');

  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
};

export const logout = async () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  const session = JSON.parse(sessionStr);
  
  // Optional: Verify token validity with backend here if needed
  return session.user;
};

// --- DATABASE SERVICES ---

export const saveTab = async (metadata: SongMetadata, content: string): Promise<SavedTab> => {
  const res = await fetch(`${API_URL}/tabs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      title: metadata.title || 'Untitled',
      artist: metadata.artist || 'Unknown',
      tuning: metadata.tuning,
      bpm: metadata.bpm,
      content
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to save tab');
  return data;
};

export const getUserTabs = async (): Promise<SavedTab[]> => {
  const res = await fetch(`${API_URL}/tabs`, {
    method: 'GET',
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to fetch tabs');
  return data;
};

export const deleteTab = async (tabId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/tabs/${tabId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.msg || 'Failed to delete tab');
  }
};