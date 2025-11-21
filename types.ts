
export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING_FILE = 'PROCESSING_FILE', // Used during initial file read
  FILE_READY = 'FILE_READY', // New state for configuration
  GENERATING_TABS = 'GENERATING_TABS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface AudioFile {
  file: File;
  url: string;
  base64: string;
  mimeType: string;
}

export interface TabResult {
  rawText: string;
  sourceUrls?: { title: string; uri: string }[];
  modelUsed?: string;
}

export interface SongMetadata {
  title: string;
  artist: string;
  bpm: string;
}