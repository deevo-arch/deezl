export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnail: string;
  url?: string;
  genre?: string;
  viewCount?: string;
  publishedAt?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  tracks: Track[];
  year?: number;
  genre?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  thumbnail: string;
  description: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  currentIndex: number;
  isLoading: boolean;
}

export interface SearchState {
  query: string;
  results: Track[];
  isSearching: boolean;
  trending: Track[];
}