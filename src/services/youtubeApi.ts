import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
}

export interface SearchResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

class YouTubeService {
  private apiKey: string;

  constructor() {
    this.apiKey = YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('YouTube API key not found. Using fallback data.');
    }
  }

  async searchVideos(query: string, maxResults: number = 20): Promise<SearchResult> {
    if (!this.apiKey) {
      return this.getFallbackResults(query);
    }

    try {
      const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
        params: {
          key: this.apiKey,
          q: query + ' music',
          part: 'snippet',
          type: 'video',
          maxResults,
          videoCategoryId: '10', // Music category
          order: 'relevance'
        }
      });

      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');
      
      // Get additional details including duration
      const detailsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
        params: {
          key: this.apiKey,
          id: videoIds,
          part: 'contentDetails,statistics,snippet'
        }
      });

      const videos: YouTubeVideo[] = detailsResponse.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: this.parseDuration(item.contentDetails.duration),
        viewCount: item.statistics.viewCount,
        publishedAt: item.snippet.publishedAt
      }));

      return {
        videos,
        nextPageToken: response.data.nextPageToken
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getFallbackResults(query);
    }
  }

  async getTrendingMusic(): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      return this.getFallbackTrending();
    }

    try {
      const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
        params: {
          key: this.apiKey,
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode: 'US',
          videoCategoryId: '10', // Music category
          maxResults: 20
        }
      });

      return response.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: this.parseDuration(item.contentDetails.duration),
        viewCount: item.statistics.viewCount,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getFallbackTrending();
    }
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
        params: {
          key: this.apiKey,
          id: videoId,
          part: 'snippet,contentDetails,statistics'
        }
      });

      const item = response.data.items[0];
      if (!item) return null;

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: this.parseDuration(item.contentDetails.duration),
        viewCount: item.statistics.viewCount,
        publishedAt: item.snippet.publishedAt
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      return null;
    }
  }

  private parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private getFallbackResults(query: string): SearchResult {
    const fallbackVideos: YouTubeVideo[] = [
      {
        id: 'dQw4w9WgXcQ',
        title: `${query} - Popular Song`,
        channelTitle: 'Music Channel',
        thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '3:32',
        viewCount: '1000000',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'L_jWHffIx5E',
        title: `${query} - Trending Hit`,
        channelTitle: 'Popular Artist',
        thumbnail: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '4:15',
        viewCount: '2500000',
        publishedAt: new Date().toISOString()
      }
    ];

    return { videos: fallbackVideos };
  }

  private getFallbackTrending(): YouTubeVideo[] {
    return [
      {
        id: 'trending1',
        title: 'Trending Song 1',
        channelTitle: 'Popular Artist',
        thumbnail: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '3:45',
        viewCount: '5000000',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'trending2',
        title: 'Trending Song 2',
        channelTitle: 'Famous Band',
        thumbnail: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '4:20',
        viewCount: '3200000',
        publishedAt: new Date().toISOString()
      }
    ];
  }
}

export const youtubeService = new YouTubeService();