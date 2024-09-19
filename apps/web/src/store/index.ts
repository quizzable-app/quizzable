import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

export type User = {
  email: string;
  firebaseUid: string;
  imageUrl: string;
  name: string;
  userId: string;
  roles: string[];
};

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user: User | null) => set(() => ({ user })),
      }),
      {
        name: "AppState",
      }
    ),
    {
      enabled: true,
      name: "AppState",
    }
  )
);
