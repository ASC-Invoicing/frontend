import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

interface Org {
  id: string;
  name: string;
  tin?: string;
}

interface UserState {
  user: User | null;
  organization: Org | null;
  setUser: (user: User | null) => void;
  setOrganization: (org: Org | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,

      setUser: (user) => set({ user }),
      setOrganization: (org) => set({ organization: org }),

      logout: () =>
        set({
          user: null,
          organization: null,
        }),
    }),
    {
      name: "asc-user-storage", 
    }
  )
);
