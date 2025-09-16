import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Company } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, user: User, company: Company) => void;
  setUser: (user: Partial<User>) => void;
  setCompany: (company: Partial<Company>) => void;
  logout: () => void;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      company: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (token, user, company) => {
        set({
          token,
          user,
          company,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setCompany: (companyData) => {
        set((state) => ({
          company: state.company ? { ...state.company, ...companyData } : null,
        }));
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({
          token: null,
          user: null,
          company: null,
          isAuthenticated: false,
        });
      },

      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        company: state.company,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
