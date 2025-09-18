import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Star } from 'lucide-react';
import TrackCard from './TrackCard';
import { Track } from '../types/music';
import { getRandomTracks, mockAlbums } from '../data/mockData';

interface HomeViewProps {
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  onTrackSelect,
  currentTrack,
  isPlaying,
  onPlay,
  onPause
}) => {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [trending, setTrending] = useState<Track[]>([]);

  useEffect(() => {
    // Generate fresh recommendations on component mount
    setRecommendations(getRandomTracks(6));
    setTrending(getRandomTracks(4));
  }, []);

  const refreshRecommendations = () => {
    setRecommendations(getRandomTracks(6));
    setTrending(getRandomTracks(4));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Good evening</h1>
            <p className="text-gray-400">Discover your new favorite tracks</p>
          </div>
          <button
            onClick={refreshRecommendations}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Refresh
          </button>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Recently Played
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.slice(0, 3).map((track) => (
              <button
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className="flex items-center gap-4 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-white truncate">{track.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Made for you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {recommendations.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                onPlay={onPlay}
                onPause={onPause}
              />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                onPlay={onPlay}
                onPause={onPause}
              />
            ))}
          </div>
        </div>

        {/* Albums */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Popular Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockAlbums.map((album) => (
              <div
                key={album.id}
                className="group bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800 hover:bg-opacity-80 hover:scale-105 border border-gray-800 hover:border-purple-500"
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                  {album.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{album.artist}</p>
                <p className="text-xs text-gray-500 mt-1">{album.year} • {album.tracks.length} tracks</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;