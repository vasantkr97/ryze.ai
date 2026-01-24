import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      workspaces: [],
      currentWorkspaceId: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, tokens } = response.data.data;

        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });

        // Fetch workspaces
        await get().fetchUserProfile();
      },

      register: async (email: string, password: string, name: string) => {
        const response = await api.post('/auth/register', { email, password, name });
        const { user, tokens } = response.data.data;

        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });

        await get().fetchUserProfile();
      },

      logout: () => {
        const { refreshToken } = get();
        if (refreshToken) {
          api.post('/auth/logout', { refreshToken }).catch(() => {});
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          workspaces: [],
          currentWorkspaceId: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        set({
          accessToken,
          refreshToken: newRefreshToken,
        });
      },

      setCurrentWorkspace: (workspaceId: string) => {
        set({ currentWorkspaceId: workspaceId });
      },

      fetchUserProfile: async () => {
        try {
          const response = await api.get('/users/profile');
          const profile = response.data.data;

          const workspaces = profile.workspaces.map((w: { role: string; workspace: Workspace }) => ({
            ...w.workspace,
            role: w.role,
          }));

          set({
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              avatar: profile.avatar,
            },
            workspaces,
            currentWorkspaceId: get().currentWorkspaceId || workspaces[0]?.id || null,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'ryze-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        currentWorkspaceId: state.currentWorkspaceId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          state.isAuthenticated = true;
          state.fetchUserProfile();
        } else {
          state && (state.isLoading = false);
        }
      },
    }
  )
);
