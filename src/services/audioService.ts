import { Howl, Howler } from 'howler';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
}

class AudioService {
  private currentHowl: Howl | null = null;
  private currentTrack: AudioTrack | null = null;
  private onPlayCallback?: () => void;
  private onPauseCallback?: () => void;
  private onEndCallback?: () => void;
  private onTimeUpdateCallback?: (time: number) => void;

  constructor() {
    // Set global volume
    Howler.volume(0.7);
  }

  async loadTrack(track: AudioTrack): Promise<boolean> {
    try {
      // Stop current track if playing
      if (this.currentHowl) {
        this.currentHowl.stop();
        this.currentHowl.unload();
      }

      // For demo purposes, we'll use a placeholder audio URL
      // In production, you'd integrate with yt-dlp or similar service
      const audioUrl = await this.getAudioUrl(track.id);
      
      this.currentHowl = new Howl({
        src: [audioUrl],
        html5: true,
        preload: true,
        onplay: () => {
          this.onPlayCallback?.();
        },
        onpause: () => {
          this.onPauseCallback?.();
        },
        onend: () => {
          this.onEndCallback?.();
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          // Fallback to demo audio
          this.loadFallbackAudio();
        },
        onplayerror: (id, error) => {
          console.error('Audio play error:', error);
        }
      });

      this.currentTrack = track;

      // Update time periodically
      const updateTime = () => {
        if (this.currentHowl && this.currentHowl.playing()) {
          const currentTime = this.currentHowl.seek() as number;
          this.onTimeUpdateCallback?.(currentTime);
          requestAnimationFrame(updateTime);
        }
      };
      updateTime();

      return true;
    } catch (error) {
      console.error('Failed to load track:', error);
      return false;
    }
  }

  play(): boolean {
    if (this.currentHowl) {
      this.currentHowl.play();
      return true;
    }
    return false;
  }

  pause(): boolean {
    if (this.currentHowl) {
      this.currentHowl.pause();
      return true;
    }
    return false;
  }

  stop(): boolean {
    if (this.currentHowl) {
      this.currentHowl.stop();
      return true;
    }
    return false;
  }

  seek(time: number): boolean {
    if (this.currentHowl) {
      this.currentHowl.seek(time);
      return true;
    }
    return false;
  }

  setVolume(volume: number): void {
    Howler.volume(volume / 100);
  }

  getCurrentTime(): number {
    if (this.currentHowl) {
      return this.currentHowl.seek() as number;
    }
    return 0;
  }

  getDuration(): number {
    if (this.currentHowl) {
      return this.currentHowl.duration();
    }
    return 0;
  }

  isPlaying(): boolean {
    return this.currentHowl ? this.currentHowl.playing() : false;
  }

  onPlay(callback: () => void): void {
    this.onPlayCallback = callback;
  }

  onPause(callback: () => void): void {
    this.onPauseCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  onTimeUpdate(callback: (time: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  private async getAudioUrl(videoId: string): Promise<string> {
    // In a real implementation, you would:
    // 1. Call your backend API that uses yt-dlp to extract audio URL
    // 2. Or use a service like Lavalink
    // 3. Or integrate with YouTube's official APIs (with proper licensing)
    
    // For demo purposes, we'll use placeholder audio
    // This would be replaced with actual audio extraction
    return this.getFallbackAudioUrl();
  }

  private getFallbackAudioUrl(): string {
    // Using a royalty-free audio file for demonstration
    // In production, replace with actual audio extraction service
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
  }

  private loadFallbackAudio(): void {
    if (this.currentHowl) {
      // Load a fallback audio file
      this.currentHowl = new Howl({
        src: [this.getFallbackAudioUrl()],
        html5: true,
        onplay: () => this.onPlayCallback?.(),
        onpause: () => this.onPauseCallback?.(),
        onend: () => this.onEndCallback?.()
      });
    }
  }
}

export const audioService = new AudioService();