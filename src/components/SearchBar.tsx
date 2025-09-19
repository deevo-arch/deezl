import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { Track } from '../types/music';
import { youtubeService, YouTubeVideo } from '../services/youtubeApi';

interface SearchBarProps {
  onTrackSelect: (track: Track) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onTrackSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const convertYouTubeToTrack = (video: YouTubeVideo): Track => ({
    id: video.id,
    title: video.title,
    artist: video.channelTitle,
    duration: parseDurationToSeconds(video.duration),
    thumbnail: video.thumbnail,
    viewCount: video.viewCount,
    publishedAt: video.publishedAt
  });

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const searchTracks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await youtubeService.searchVideos(query, 10);
      const tracks = result.videos.map(convertYouTubeToTrack);
      setSearchResults(tracks);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTracks(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchTracks]);

  const handleTrackSelect = (track: Track) => {
    onTrackSelect(track);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for songs, artists, albums..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-10 py-3 bg-gray-800 bg-opacity-60 backdrop-blur-sm text-white placeholder-gray-400 rounded-full border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showResults && (searchResults.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-400">Searching YouTube...</span>
              </div>
            ) : (
              <>
                {searchResults.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Search Results</span>
                    </div>
                    {searchResults.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleTrackSelect(track)}
                        className="w-full px-3 py-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg transition-colors text-left"
                      >
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate text-sm">
                            {track.title}
                          </h4>
                          <p className="text-gray-400 text-xs truncate">
                            {track.artist}
                          </p>
                          {track.viewCount && (
                            <p className="text-gray-500 text-xs">
                              {formatViewCount(track.viewCount)}
                            </p>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {formatDuration(track.duration)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;