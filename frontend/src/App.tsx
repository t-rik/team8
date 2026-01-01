import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { QuestBoard } from './components/QuestBoard';
import { MatchFeed } from './components/MatchFeed';
import { Login } from './pages/Login';
import { useStore } from './store/useStore';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<'quests' | 'feed'>('quests');
  const { user, fetchUser, isLoadingUser } = useStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoadingUser) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono animate-pulse">Initializing System...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'quests' ? <QuestBoard /> : <MatchFeed />}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
