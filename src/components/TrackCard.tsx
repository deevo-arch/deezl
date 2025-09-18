import React from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Track } from '../types/music';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, isPlaying, onPlay, onPause }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800 hover:bg-opacity-80 hover:scale-105 border border-gray-800 hover:border-purple-500">
      <div className="relative mb-3">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <button
            onClick={() => isPlaying ? onPause() : onPlay(track)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{track.genre}</span>
          <span>{formatDuration(track.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;