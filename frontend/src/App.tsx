import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { QuestBoard } from './components/QuestBoard';
import { MatchFeed } from './components/MatchFeed';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<'quests' | 'feed'>('quests');

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'quests' ? <QuestBoard /> : <MatchFeed />}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
