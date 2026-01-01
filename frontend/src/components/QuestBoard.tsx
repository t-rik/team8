import { useStore } from '../store/useStore';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export function QuestBoard() {
  const { projects, toggleLookingForMatch } = useStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-white">Quest Board <span className="text-primary">.synced</span></h1>
      <p className="text-gray-400 mb-8">Toggle "Looking for Team8" to appear in the feed for specific projects.</p>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div 
            key={project.project_id}
            className={`p-6 rounded-xl border transition-all ${
              project.looking_for_match 
                ? 'bg-surface border-primary shadow-[0_0_15px_rgba(0,184,148,0.2)]' 
                : 'bg-[#151520] border-gray-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{project.project_name}</h3>
                  {project.status === 'finished' && <span className="text-green-500 text-xs px-2 py-1 bg-green-900/30 rounded">Finished</span>}
                  {project.status === 'in_progress' && <span className="text-blue-400 text-xs px-2 py-1 bg-blue-900/30 rounded">In Progress</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">Project ID: {project.project_id}</p>
              </div>

              <button
                onClick={() => toggleLookingForMatch(project.project_id)}
                className={`flex items-center gap-3 px-5 py-2 rounded-full font-bold transition-all ${
                  project.looking_for_match
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {project.looking_for_match ? (
                  <>
                    <ToggleRight className="w-6 h-6" />
                    <span>SEEKING PARTNER</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-6 h-6" />
                    <span>SOLO MODE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
