import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, List, Loader } from 'lucide-react';
import { Track } from '../types/music';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onShowQueue: () => void;
}

const Player: React.FC<PlayerProps> = ({
  currentTrack,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onShowQueue
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  if (!currentTrack) {
    return (
      <div className="h-24 bg-black bg-opacity-95 backdrop-blur-sm border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Select a track to start playing</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-black bg-opacity-95 backdrop-blur-sm border-t border-gray-800 px-6 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-medium truncate">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
        <button className="text-gray-400 hover:text-red-500 transition-colors ml-2">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={onPrevious}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={isLoading}
            className="bg-white hover:bg-gray-200 text-black p-2 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div
              className="absolute top-0 left-0 h-1 bg-purple-500 rounded-lg pointer-events-none"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume and Queue */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <button
          onClick={onShowQueue}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <List className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Player;