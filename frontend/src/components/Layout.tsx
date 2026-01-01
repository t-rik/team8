import React from 'react';
import { useStore } from '../store/useStore';
import { Terminal, Users, Search, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'quests' | 'feed';
  onTabChange: (tab: 'quests' | 'feed') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { user } = useStore();

  const handleLogout = () => {
    // In a real app, you'd call an API to clear the cookie, then reload/redirect
    document.cookie = 'team8_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background text-gray-300 flex">
      {/* Sidebar */}
      <nav className="w-64 border-r border-surface p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-primary font-bold text-2xl">
          <Terminal className="w-8 h-8" />
          <span>TEAM8</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onTabChange('quests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'quests' ? 'bg-surface text-primary border-l-4 border-primary' : 'hover:bg-surface'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Quest Board</span>
          </button>
          
          <button
            onClick={() => onTabChange('feed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'feed' ? 'bg-surface text-secondary border-l-4 border-secondary' : 'hover:bg-surface'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Partner Feed</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-surface space-y-4">
          <div className="text-xs text-gray-500 font-mono">
            Logged in as <br />
            <span className="text-white text-sm">{user?.login}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-danger hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
