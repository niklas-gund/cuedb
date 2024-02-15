import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  isLoggedIn: boolean;
  username: string;
  accessrights: {
    perm_add_movie: boolean;
    perm_submit_set: boolean;
    perm_review_set: boolean;
    perm_user_rights_management: boolean;
    perm_add_contributor: boolean;
  };
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        username: "",
        accessrights: {
          perm_add_movie: false,
          perm_submit_set: false,
          perm_review_set: false,
          perm_user_rights_management: false,
          perm_add_contributor: false,
        },
        setIsLoggedIn: (loggedIn) => set(() => ({ isLoggedIn: loggedIn })),
        setUsername: (name) => set(() => ({ username: name })),
      }),
      {
        name: "user-store",
      }
    )
  )
);
