import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, List } from 'lucide-react';
import { Track } from '../types/music';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  queue: Track[];
  onShowQueue: () => void;
}

const Player: React.FC<PlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  queue,
  onShowQueue
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            onNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, onNext]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  if (!currentTrack) {
    return (
      <div className="h-24 bg-black bg-opacity-95 backdrop-blur-sm border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-500">No track selected</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-black bg-opacity-95 backdrop-blur-sm border-t border-gray-800 px-6 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-14 h-14 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-white font-medium truncate">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`ml-2 transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
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
            className="bg-white hover:bg-gray-200 text-black p-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
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
              max={currentTrack.duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <span className="text-xs text-gray-400 min-w-[40px]">
            {formatTime(currentTrack.duration)}
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
            onChange={(e) => setVolume(parseInt(e.target.value))}
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