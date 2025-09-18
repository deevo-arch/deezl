import { Track, Album } from '../types/music';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Drive',
    artist: 'Neon Dreams',
    album: 'Electric Nights',
    duration: 240,
    cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Electronic'
  },
  {
    id: '2',
    title: 'Ocean Waves',
    artist: 'Ambient Flow',
    album: 'Nature Sounds',
    duration: 180,
    cover: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Ambient'
  },
  {
    id: '3',
    title: 'City Lights',
    artist: 'Urban Echo',
    album: 'Metropolis',
    duration: 200,
    cover: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Hip Hop'
  },
  {
    id: '4',
    title: 'Starfield',
    artist: 'Cosmic Journey',
    album: 'Space Odyssey',
    duration: 320,
    cover: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Ambient'
  },
  {
    id: '5',
    title: 'Thunder Storm',
    artist: 'Nature Beats',
    album: 'Weather Patterns',
    duration: 280,
    cover: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Nature'
  },
  {
    id: '6',
    title: 'Digital Dreams',
    artist: 'Synth Wave',
    album: 'Retro Future',
    duration: 210,
    cover: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Synthwave'
  },
  {
    id: '7',
    title: 'Forest Path',
    artist: 'Zen Masters',
    album: 'Meditation Journey',
    duration: 360,
    cover: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Meditation'
  },
  {
    id: '8',
    title: 'Neon Nights',
    artist: 'Cyberpunk City',
    album: 'Future Noir',
    duration: 195,
    cover: 'https://images.pexels.com/photos/1806031/pexels-photo-1806031.jpeg?auto=compress&cs=tinysrgb&w=300',
    url: '#',
    genre: 'Cyberpunk'
  }
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Electric Nights',
    artist: 'Neon Dreams',
    cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: mockTracks.slice(0, 3),
    year: 2023,
    genre: 'Electronic'
  },
  {
    id: '2',
    title: 'Nature Sounds',
    artist: 'Ambient Flow',
    cover: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: mockTracks.slice(1, 4),
    year: 2022,
    genre: 'Ambient'
  },
  {
    id: '3',
    title: 'Space Odyssey',
    artist: 'Cosmic Journey',
    cover: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: mockTracks.slice(3, 6),
    year: 2023,
    genre: 'Ambient'
  }
];

export const getRandomTracks = (count: number = 6): Track[] => {
  const shuffled = [...mockTracks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};