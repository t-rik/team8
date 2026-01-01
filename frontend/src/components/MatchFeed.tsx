
import { useQuery } from '@tanstack/react-query';
import { UserPlus, Shield, Zap } from 'lucide-react';

interface Candidate {
  id: number;
  login: string;
  level: number;
  image_url: string;
  matched_projects: string;
  score: number;
}

export function MatchFeed() {
  // Mock fetch for now, replace with actual fetch to backend when running
  const { data: candidates, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
        // In a real scenario, this would be: await fetch('http://localhost:8787/api/feed').then(res => res.json())
        // For development without the backend running simultaneously in the same terminal, we'll mock:
        return [
            { id: 2, login: 'match_maker', level: 5.6, image_url: 'https://ui-avatars.com/api/?name=Match+Maker', matched_projects: 'Minishell', score: 140 },
            { id: 3, login: 'expert_deviant', level: 12.0, image_url: 'https://ui-avatars.com/api/?name=Expert', matched_projects: 'Minishell', score: 110 },
        ] as Candidate[];
    }
  });

  if (isLoading) return <div className="text-center p-10 animate-pulse">Scanning the Blackhole...</div>;

  return (
    <div className="max-w-4xl mx-auto">
       <h1 className="text-3xl font-bold mb-2 text-white">Partner Feed <span className="text-secondary">.live</span></h1>
       <p className="text-gray-400 mb-8">Candidates matching your active quests.</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {candidates?.map((candidate) => (
           <div key={candidate.id} className="bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-secondary transition-all group">
             <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative p-4">
                <div className="absolute top-4 right-4 text-2xl font-bold text-accent">
                    {candidate.score} <span className="text-xs text-gray-500">PTS</span>
                </div>
             </div>
             <div className="px-6 relative">
               <div className="absolute -top-12 border-4 border-surface rounded-full overflow-hidden">
                 <img src={candidate.image_url} alt={candidate.login} className="w-24 h-24 bg-gray-700" />
               </div>
               <div className="mt-14 pb-6 space-y-4">
                 <div>
                   <h2 className="text-2xl font-bold flex items-center gap-2">
                     {candidate.login}
                     <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">Lvl {candidate.level}</span>
                   </h2>
                   <p className="text-primary text-sm mt-1 flex items-center gap-1">
                     <Zap className="w-3 h-3" /> Matching on: {candidate.matched_projects}
                   </p>
                 </div>

                {/* Badges based on score logic */}
                 <div className="flex gap-2 flex-wrap">
                   {candidate.score >= 130 && (
                     <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 flex items-center gap-1">
                       <Shield className="w-3 h-3" /> Power Duo
                     </span>
                   )}
                   {Math.abs(candidate.level - 5.5) > 5 && (
                     <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                       Veteran
                     </span>
                   )}
                 </div>

                 <button className="w-full py-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/50 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                   <UserPlus className="w-5 h-5" />
                   Invite to Team8
                 </button>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
