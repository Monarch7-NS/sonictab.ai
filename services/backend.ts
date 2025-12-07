import { User, SavedTab, SongMetadata } from '../types';

/**
 * MOCK BACKEND SERVICE
 * 
 * In a real production environment, this file would be replaced by API calls 
 * to an Express.js server connected to MongoDB.
 * 
 * Current Implementation:
 * - Database: Browser LocalStorage (Simulating MongoDB)
 * - API: Async functions with delays (Simulating Network Latency)
 * - Auth: Mock JWT Token generation
 */

const DB_USERS_KEY = 'tabsense_db_users';
const DB_TABS_KEY = 'tabsense_db_tabs';
const SESSION_KEY = 'tabsense_session_token';

// Seed Database with Admin User if not exists
const seedDatabase = () => {
  const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
  if (!users.find((u: any) => u.username === 'admin')) {
    users.push({
      id: 'usr_admin_001',
      username: 'admin',
      password: 'admin', // In real app, this would be hashed (bcrypt)
      isAdmin: true
    });
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  }
};

// Initialize
seedDatabase();

// --- AUTH SERVICES ---

export const register = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
  
  if (users.find((u: any) => u.username === username)) {
    throw new Error('Username already exists');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    password, // In real app, hash this
    isAdmin: false
  };

  users.push(newUser);
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));

  // Auto login after registration
  const token = `jwt_${newUser.id}_${Date.now()}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, userId: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin }));

  return {
    user: { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
    token
  };
};

export const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
  const user = users.find((u: any) => u.username === username && u.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Generate Mock Token
  const token = `jwt_${user.id}_${Date.now()}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, userId: user.id, username: user.username, isAdmin: user.isAdmin }));

  return {
    user: { id: user.id, username: user.username, isAdmin: user.isAdmin },
    token
  };
};

export const logout = async () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  const session = JSON.parse(sessionStr);
  return { id: session.userId, username: session.username, isAdmin: session.isAdmin };
};

// --- DATABASE SERVICES ---

export const saveTab = async (metadata: SongMetadata, content: string): Promise<SavedTab> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const newTab: SavedTab = {
    id: `tab_${Date.now()}`,
    userId: user.id,
    title: metadata.title || 'Untitled Song',
    artist: metadata.artist || 'Unknown Artist',
    tuning: metadata.tuning,
    bpm: metadata.bpm,
    content: content,
    createdAt: new Date().toISOString()
  };

  const allTabs = JSON.parse(localStorage.getItem(DB_TABS_KEY) || '[]');
  allTabs.push(newTab);
  localStorage.setItem(DB_TABS_KEY, JSON.stringify(allTabs));

  return newTab;
};

export const getUserTabs = async (): Promise<SavedTab[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const allTabs = JSON.parse(localStorage.getItem(DB_TABS_KEY) || '[]');
  
  // MongoDB Query Simulation: db.tabs.find({ userId: user.id })
  return allTabs.filter((tab: SavedTab) => tab.userId === user.id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const deleteTab = async (tabId: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  let allTabs = JSON.parse(localStorage.getItem(DB_TABS_KEY) || '[]');
  allTabs = allTabs.filter((tab: SavedTab) => tab.id !== tabId);
  localStorage.setItem(DB_TABS_KEY, JSON.stringify(allTabs));
};