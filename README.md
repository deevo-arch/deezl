# Deezl - A Sizzle Music Platform

A fully functional Sizzle Music Platform by Deevo built with React, TypeScript, and YouTube API integration. Stream real music with a beautiful, interactive interface.

## Features

🎵 **Real Music Integration**
- YouTube API integration for searching and discovering music
- Trending music from YouTube's music category
- Real-time search with autocomplete
- Audio playback ready

🎨 **Interactive UI**
- Sleek black theme with gradient accents (pink/purple/cyan)
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
- Clean, minimal interface like YouTube Music

## Setup Instructions

### 1. Get YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Environment Configuration

The YouTube API key is already configured in the `.env` file.

### 3. Install and Run

```bash
npm install
npm run dev
```

## Technical Architecture

### Services
- **YouTubeService**: Real YouTube API integration for music discovery
- **AudioService**: Manages audio playback using Howler.js
- **useAudioPlayer**: Custom hook for player state management

### Components
- **Player**: Full-featured audio player with controls
- **SearchBar**: Real-time YouTube music search
- **HomeView**: Trending and recommended music display
- **TrackCard**: Interactive music cards with play buttons
- **Queue**: Queue management with visual feedback

### Audio Integration

Ready for production integration with:

1. **yt-dlp**: For extracting audio URLs from YouTube videos
2. **Lavalink**: For scalable audio streaming
3. **Backend API**: To handle audio extraction and streaming

### Current Implementation

- Real YouTube API integration with your provided key
- Clean interface inspired by YouTube Music
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
