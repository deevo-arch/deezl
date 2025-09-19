import React from 'react';
import { Play, Pause, Heart, MoreHorizontal, Eye } from 'lucide-react';
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

  const formatViewCount = (count?: string) => {
    if (!count) return '';
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="group bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800 hover:bg-opacity-80 hover:scale-105 border border-gray-800 hover:border-purple-500">
      <div className="relative mb-3">
        <img
          src={track.thumbnail}
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
        {track.viewCount && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatViewCount(track.viewCount)}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors text-sm">
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{track.genre || 'Music'}</span>
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