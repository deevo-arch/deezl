import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Track } from '../types/music';
import { mockTracks } from '../data/mockData';

interface SearchBarProps {
  onTrackSelect: (track: Track) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onTrackSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const filtered = mockTracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTimeout(() => {
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tracks, artists, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-800 bg-opacity-60 backdrop-blur-sm text-white placeholder-gray-400 rounded-full border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  onTrackSelect(track);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{track.title}</h4>
                  <p className="text-gray-400 text-sm truncate">{track.artist} • {track.album}</p>
                </div>
                <span className="text-gray-500 text-sm">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-400">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;