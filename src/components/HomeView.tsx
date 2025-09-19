import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Star, RefreshCw } from 'lucide-react';
import TrackCard from './TrackCard';
import { Track } from '../types/music';
import { youtubeService, YouTubeVideo } from '../services/youtubeApi';

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
  const [trending, setTrending] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadTrendingMusic = async () => {
    setIsLoading(true);
    try {
      const trendingVideos = await youtubeService.getTrendingMusic();
      const trendingTracks = trendingVideos.map(convertYouTubeToTrack);
      setTrending(trendingTracks);

      // Get recommendations based on popular genres
      const genres = ['pop music', 'rock music', 'hip hop music', 'electronic music'];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      const searchResult = await youtubeService.searchVideos(randomGenre, 12);
      const recommendedTracks = searchResult.videos.map(convertYouTubeToTrack);
      setRecommendations(recommendedTracks);
    } catch (error) {
      console.error('Failed to load music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrendingMusic();
  }, []);

  const refreshRecommendations = () => {
    loadTrendingMusic();
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Good evening</h1>
            <p className="text-gray-400">Discover trending music from YouTube</p>
          </div>
          <button
            onClick={refreshRecommendations}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Quick Access - Trending */}
        {trending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Trending Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.slice(0, 6).map((track) => (
                <button
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className="flex items-center gap-4 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 hover:scale-105 text-left"
                >
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {track.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                    {track.viewCount && (
                      <p className="text-gray-500 text-xs">
                        {parseInt(track.viewCount) >= 1000000 
                          ? `${(parseInt(track.viewCount) / 1000000).toFixed(1)}M views`
                          : `${(parseInt(track.viewCount) / 1000).toFixed(0)}K views`
                        }
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Recommended for you
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
        )}

        {/* Recently Popular */}
        {trending.length > 6 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recently Popular
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trending.slice(6, 16).map((track) => (
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
        )}
      </div>
    </div>
  );
};

export default HomeView;