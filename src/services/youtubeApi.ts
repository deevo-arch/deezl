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
    this.apiKey = YOUTUBE_API_KEY;
  }

  async searchVideos(query: string, maxResults: number = 20): Promise<SearchResult> {
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
      return { videos: [] };
    }
  }

  async getTrendingMusic(): Promise<YouTubeVideo[]> {
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
      return [];
    }
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
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
}

export const youtubeService = new YouTubeService();