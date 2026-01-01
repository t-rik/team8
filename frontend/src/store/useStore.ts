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
  isLoadingUser: boolean;
  projects: Project[];
  fetchUser: () => Promise<void>;
  toggleLookingForMatch: (projectId: number) => void;
}

export const useStore = create<UserState>((set) => ({
  user: null,
  isLoadingUser: true,
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
  fetchUser: async () => {
    try {
      const res = await fetch('http://localhost:8787/api/auth/me'); // Direct to worker
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoadingUser: false });
      } else {
        set({ user: null, isLoadingUser: false });
      }
    } catch (error) {
       console.error("Failed to fetch user", error);
       set({ user: null, isLoadingUser: false });
    }
  },
  toggleLookingForMatch: (projectId) => set((state) => ({
    projects: state.projects.map(p => 
      p.project_id === projectId 
        ? { ...p, looking_for_match: !p.looking_for_match }
        : p
    )
  }))
}));
