import React from 'react';
import { X, Music, MoreHorizontal } from 'lucide-react';
import { Track } from '../types/music';

interface QueueProps {
  queue: Track[];
  currentIndex: number;
  onClose: () => void;
  onTrackSelect: (index: number) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, currentIndex, onClose, onTrackSelect }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-l border-gray-800 z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Queue</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Music className="w-16 h-16 mb-4" />
            <p>Queue is empty</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Now Playing
            </h3>
            {queue.map((track, index) => (
              <button
                key={track.id}
                onClick={() => onTrackSelect(index)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all duration-200 text-left ${
                  index === currentIndex
                    ? 'bg-purple-600 bg-opacity-20 border border-purple-500'
                    : 'hover:bg-gray-800 bg-opacity-50'
                }`}
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${
                    index === currentIndex ? 'text-purple-300' : 'text-white'
                  }`}>
                    {track.title}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;