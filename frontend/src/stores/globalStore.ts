import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface GlobalState {
  backlink: string;
  setBacklink: (link: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        backlink: "",
        setBacklink: (link) => {
          set(() => ({ backlink: link }));
          console.log("set,,,,,,,,,,,", link);
        },
      }),
      {
        name: "global-store",
      }
    )
  )
);
