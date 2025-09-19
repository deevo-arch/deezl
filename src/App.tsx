import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import SearchBar from './components/SearchBar';
import Player from './components/Player';
import Queue from './components/Queue';
import { Track } from './types/music';
import { useAudioPlayer } from './hooks/useAudioPlayer';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    loadTrack,
    play,
    pause,
    seek,
    changeVolume
  } = useAudioPlayer();

  const handleTrackSelect = async (track: Track) => {
    const success = await loadTrack(track);
    if (success) {
      // Add to queue if not already there
      if (!queue.find(t => t.id === track.id)) {
        const newQueue = [...queue, track];
        setQueue(newQueue);
        setCurrentIndex(newQueue.length - 1);
      } else {
        const index = queue.findIndex(t => t.id === track.id);
        setCurrentIndex(index);
      }
      play();
    }
  };

  const handlePlay = async (track?: Track) => {
    if (track) {
      await handleTrackSelect(track);
    } else {
      play();
    }
  };

  const handleNext = async () => {
    if (queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIndex);
      await loadTrack(queue[nextIndex]);
      play();
    }
  };

  const handlePrevious = async () => {
    if (queue.length > 0) {
      const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      await loadTrack(queue[prevIndex]);
      play();
    }
  };

  const handleQueueTrackSelect = async (index: number) => {
    setCurrentIndex(index);
    await loadTrack(queue[index]);
    play();
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="bg-black bg-opacity-60 backdrop-blur-sm p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  →
                </button>
              </div>
              
              <SearchBar onTrackSelect={handleTrackSelect} />
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {activeView === 'home' && (
            <HomeView
              onTrackSelect={handleTrackSelect}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={pause}
            />
          )}
          
          {activeView === 'search' && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-blue-900 p-8">
              <h1 className="text-4xl font-bold text-white mb-8">Search</h1>
              <p className="text-gray-400 mb-8">Use the search bar above to find your favorite music from YouTube</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B'].map((genre) => (
                  <div
                    key={genre}
                    className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <h3 className="text-white font-bold text-lg">{genre}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeView === 'library' && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-green-900 p-8">
              <h1 className="text-4xl font-bold text-white mb-8">Your Library</h1>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Recently Played</h2>
                  <div className="space-y-2">
                    {queue.slice(0, 5).map((track, index) => (
                      <div
                        key={track.id}
                        onClick={() => handleQueueTrackSelect(index)}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 bg-opacity-60 backdrop-blur-sm hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                      >
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{track.title}</h3>
                          <p className="text-gray-400 text-sm">{track.artist}</p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Queue Sidebar */}
        {showQueue && (
          <Queue
            queue={queue}
            currentIndex={currentIndex}
            onClose={() => setShowQueue(false)}
            onTrackSelect={handleQueueTrackSelect}
          />
        )}
      </div>

      {/* Player */}
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isLoading={isLoading}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onPlay={play}
        onPause={pause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={seek}
        onVolumeChange={changeVolume}
        onShowQueue={() => setShowQueue(!showQueue)}
      />
    </div>
  );
}

export default App;