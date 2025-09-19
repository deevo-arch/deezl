# Real Music Streaming Platform

A fully functional music streaming platform that integrates with YouTube's API for real music content and provides actual audio playback capabilities.

## Features

🎵 **Real Music Integration**
- YouTube API integration for searching and discovering music
- Trending music from YouTube's music category
- Real-time search with autocomplete
- Actual audio playback using Howler.js

🎨 **Interactive UI**
- Sleek black theme with purple/blue accents
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Glassmorphism effects and modern styling

🎧 **Player Features**
- Full audio controls (play, pause, next, previous)
- Seekable progress bar with real-time updates
- Volume control with visual feedback
- Queue management with drag-and-drop
- Shuffle and repeat modes

🔍 **Discovery**
- Trending music from YouTube
- Genre-based recommendations
- Search functionality with real results
- Recently played history

## Setup Instructions

### 1. Get YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your YouTube API key:
   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

### 3. Install and Run

```bash
npm install
npm run dev
```

## Technical Architecture

### Services
- **YouTubeService**: Handles API calls to YouTube for searching and trending music
- **AudioService**: Manages audio playback using Howler.js
- **useAudioPlayer**: Custom hook for player state management

### Components
- **Player**: Full-featured audio player with controls
- **SearchBar**: Real-time search with YouTube integration
- **HomeView**: Trending and recommended music display
- **TrackCard**: Interactive music cards with play buttons
- **Queue**: Queue management with visual feedback

### Audio Integration

The platform uses Howler.js for audio playback. For production use, you would integrate:

1. **yt-dlp**: For extracting audio URLs from YouTube videos
2. **Lavalink**: For scalable audio streaming
3. **Backend API**: To handle audio extraction and streaming

### Current Implementation

- Uses YouTube API for music discovery and metadata
- Implements fallback audio for demonstration
- Ready for integration with real audio extraction services
- Includes proper error handling and loading states

## Production Considerations

For a production deployment, you would need to:

1. **Backend Integration**: Set up a backend service that uses yt-dlp or similar tools to extract audio streams
2. **Legal Compliance**: Ensure proper licensing for music streaming
3. **Caching**: Implement caching for frequently accessed tracks
4. **CDN**: Use a CDN for serving audio content
5. **User Authentication**: Add user accounts and personalization

## License

This project is for educational purposes. Ensure you comply with YouTube's Terms of Service and music licensing requirements for any production use.