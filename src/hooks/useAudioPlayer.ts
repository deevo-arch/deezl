import { useState, useEffect, useCallback } from 'react';
import { audioService } from '../services/audioService';
import { Track } from '../types/music';

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    audioService.onPlay(() => setIsPlaying(true));
    audioService.onPause(() => setIsPlaying(false));
    audioService.onEnd(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    audioService.onTimeUpdate((time) => setCurrentTime(time));
  }, []);

  const loadTrack = useCallback(async (track: Track) => {
    setIsLoading(true);
    const audioTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail,
      duration: track.duration
    };

    const success = await audioService.loadTrack(audioTrack);
    if (success) {
      setCurrentTrack(track);
      setDuration(audioService.getDuration() || track.duration);
    }
    setIsLoading(false);
    return success;
  }, []);

  const play = useCallback(() => {
    if (audioService.play()) {
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioService.pause()) {
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioService.stop()) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioService.seek(time)) {
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioService.setVolume(newVolume);
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    loadTrack,
    play,
    pause,
    stop,
    seek,
    changeVolume
  };
};