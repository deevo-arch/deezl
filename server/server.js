import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import NodeCache from 'node-cache';
import { spawn } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cache for 30 minutes
const cache = new NodeCache({ stdTTL: 1800 });

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get audio stream URL using yt-dlp
app.get('/api/audio/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const quality = req.query.quality || 'bestaudio';

  try {
    // Check cache first
    const cacheKey = `audio_${videoId}_${quality}`;
    const cachedUrl = cache.get(cacheKey);
    
    if (cachedUrl) {
      return res.json({ 
        success: true, 
        audioUrl: cachedUrl,
        cached: true,
        videoId 
      });
    }

    console.log(`Extracting audio URL for video: ${videoId}`);

    // Use yt-dlp to get audio URL
    const audioUrl = await extractAudioUrl(videoId, quality);
    
    if (!audioUrl) {
      return res.status(404).json({ 
        success: false, 
        error: 'Audio URL not found',
        videoId 
      });
    }

    // Cache the result
    cache.set(cacheKey, audioUrl);

    res.json({ 
      success: true, 
      audioUrl,
      cached: false,
      videoId 
    });

  } catch (error) {
    console.error('Audio extraction error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      videoId 
    });
  }
});

// Get video metadata using yt-dlp
app.get('/api/metadata/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    // Check cache first
    const cacheKey = `metadata_${videoId}`;
    const cachedMetadata = cache.get(cacheKey);
    
    if (cachedMetadata) {
      return res.json({ 
        success: true, 
        metadata: cachedMetadata,
        cached: true,
        videoId 
      });
    }

    console.log(`Extracting metadata for video: ${videoId}`);

    const metadata = await extractMetadata(videoId);
    
    if (!metadata) {
      return res.status(404).json({ 
        success: false, 
        error: 'Metadata not found',
        videoId 
      });
    }

    // Cache the result
    cache.set(cacheKey, metadata);

    res.json({ 
      success: true, 
      metadata,
      cached: false,
      videoId 
    });

  } catch (error) {
    console.error('Metadata extraction error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      videoId 
    });
  }
});

// Proxy audio stream
app.get('/api/stream/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  try {
    const audioUrl = await extractAudioUrl(videoId, 'bestaudio');
    
    if (!audioUrl) {
      return res.status(404).json({ error: 'Audio stream not found' });
    }

    // Redirect to the actual audio URL
    res.redirect(audioUrl);

  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract audio URL using yt-dlp
async function extractAudioUrl(videoId, quality = 'bestaudio') {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', [
      '--get-url',
      '--format', quality,
      '--no-playlist',
      '--no-warnings',
      `https://www.youtube.com/watch?v=${videoId}`
    ]);

    let audioUrl = '';
    let errorOutput = '';

    ytdlp.stdout.on('data', (data) => {
      audioUrl += data.toString();
    });

    ytdlp.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && audioUrl.trim()) {
        resolve(audioUrl.trim());
      } else {
        console.error('yt-dlp error:', errorOutput);
        reject(new Error(`yt-dlp failed with code ${code}: ${errorOutput}`));
      }
    });

    ytdlp.on('error', (error) => {
      console.error('yt-dlp spawn error:', error);
      reject(error);
    });
  });
}

// Extract metadata using yt-dlp
async function extractMetadata(videoId) {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', [
      '--dump-json',
      '--no-playlist',
      '--no-warnings',
      `https://www.youtube.com/watch?v=${videoId}`
    ]);

    let jsonOutput = '';
    let errorOutput = '';

    ytdlp.stdout.on('data', (data) => {
      jsonOutput += data.toString();
    });

    ytdlp.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && jsonOutput.trim()) {
        try {
          const metadata = JSON.parse(jsonOutput.trim());
          resolve({
            title: metadata.title,
            uploader: metadata.uploader,
            duration: metadata.duration,
            thumbnail: metadata.thumbnail,
            description: metadata.description,
            upload_date: metadata.upload_date,
            view_count: metadata.view_count,
            like_count: metadata.like_count,
            formats: metadata.formats?.map(f => ({
              format_id: f.format_id,
              ext: f.ext,
              quality: f.quality,
              filesize: f.filesize
            }))
          });
        } catch (parseError) {
          reject(new Error(`Failed to parse metadata: ${parseError.message}`));
        }
      } else {
        console.error('yt-dlp metadata error:', errorOutput);
        reject(new Error(`yt-dlp failed with code ${code}: ${errorOutput}`));
      }
    });

    ytdlp.on('error', (error) => {
      console.error('yt-dlp spawn error:', error);
      reject(error);
    });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Deezl Backend Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎧 Audio API: http://localhost:${PORT}/api/audio/:videoId`);
  console.log(`📊 Metadata API: http://localhost:${PORT}/api/metadata/:videoId`);
});