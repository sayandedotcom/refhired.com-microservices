import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type UserStore = {
  id: string | null;
  setId: (id: string) => void;
};

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    id: null,
    setId: (id) => {
      set((state) => {
        state.id = id;
      });
    },
  }))
);
