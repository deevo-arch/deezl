import React from 'react';
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Your Library' },
  ];

  const playlists = [
    'Liked Songs',
    'Recently Played',
    'My Playlist #1',
    'Chill Vibes',
    'Workout Hits'
  ];

  return (
    <div className="w-64 bg-black bg-opacity-90 backdrop-blur-sm p-6 flex flex-col h-full border-r border-gray-800">
      <div className="flex items-center gap-2 mb-8">
        <Music className="w-8 h-8 text-purple-500" />
        <h1 className="text-xl font-bold text-white">StreamWave</h1>
      </div>

      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-semibold">Playlists</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {playlists.map((playlist, index) => (
          <button
            key={index}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-white transition-colors text-left"
          >
            {index === 0 ? <Heart className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            <span className="text-sm truncate">{playlist}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;