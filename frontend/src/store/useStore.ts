import { create } from 'zustand';

export interface Project {
  project_id: number;
  project_name: string;
  status: 'in_progress' | 'searching' | 'finished';
  looking_for_match: boolean;
  has_team: boolean;
}

interface UserState {
  user: {
    id: number;
    login: string;
    level: number;
    image_url: string;
  } | null;
  projects: Project[];
  toggleLookingForMatch: (projectId: number) => void;
}

export const useStore = create<UserState>((set) => ({
  user: {
    id: 1,
    login: "current_user",
    level: 5.45,
    image_url: "https://ui-avatars.com/api/?name=Current+User&background=0D8ABC&color=fff"
  },
  projects: [
    {
      project_id: 42,
      project_name: "Minishell",
      status: "in_progress",
      looking_for_match: true,
      has_team: false,
    },
    {
      project_id: 21,
      project_name: "NetPractice",
      status: "finished",
      looking_for_match: false,
      has_team: true,
    }
  ],
  toggleLookingForMatch: (projectId) => set((state) => ({
    projects: state.projects.map(p => 
      p.project_id === projectId 
        ? { ...p, looking_for_match: !p.looking_for_match }
        : p
    )
  }))
}));
