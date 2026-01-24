import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setCurrentWorkspace: (workspaceId: string) => void;
  fetchUserProfile: () => Promise<void>;
}

const MOCK_USER: User = {
  id: '1',
  email: 'demo@ryze.ai',
  name: 'Demo User',
  avatar: null,
};

const MOCK_WORKSPACE: Workspace = {
  id: 'ws-1',
  name: 'Demo Workspace',
  slug: 'demo-workspace',
  plan: 'pro',
  role: 'owner',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
      workspaces: [MOCK_WORKSPACE],
      currentWorkspaceId: MOCK_WORKSPACE.id,
      isAuthenticated: true,
      isLoading: false,

      login: async () => {
        set({
          user: MOCK_USER,
          accessToken: 'mock-token',
          isAuthenticated: true,
        });
      },

      register: async () => {
        set({
          user: MOCK_USER,
          accessToken: 'mock-token',
          isAuthenticated: true,
        });
      },

      logout: () => {
        // No-op for demo mode, or reset to initial state (which is logged in anyway in this implementation)
        // But to feel "real" we could clear it? 
        // For "No Backend" requested by user, keeping them in Dashboard is safest.
        console.log('Logout clicked - staying in Demo Mode');
      },

      refreshAccessToken: async () => {}, // No-op

      setCurrentWorkspace: (workspaceId: string) => {
        set({ currentWorkspaceId: workspaceId });
      },

      fetchUserProfile: async () => {
        set({
          user: MOCK_USER,
          workspaces: [MOCK_WORKSPACE],
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: 'ryze-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        currentWorkspaceId: state.currentWorkspaceId,
      }),
    }
  )
);
