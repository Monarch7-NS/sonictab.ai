export interface TabFile {
  name: string;
  content: string;
  audioUrl: string;
}

export interface SongMetadata {
  title: string;
  artist: string;
  tuning: string;
  bpm: string;
  note: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface SavedTab {
  id: string;
  userId: string;
  title: string;
  artist: string;
  tuning: string;
  bpm: string;
  content: string;
  createdAt: string;
}

export enum AppState {
  LOGIN = 'LOGIN',
  LIBRARY = 'LIBRARY',
  UPLOAD = 'UPLOAD',
  CONFIGURATION = 'CONFIGURATION',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}