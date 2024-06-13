// authStore.ts
import create from 'zustand';
import { User } from 'firebase/auth';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserDataStore {
    user: User | null;
    setUser: (user: User | null) => void;
	signedIn: boolean;
	logOut: () => void;
}

export const useAuth = create<UserDataStore>()(
	persist(
		(set, get) => ({
			signedIn: false,
			user: null,

			setUser: (updatedUser) => {
				set({ user: updatedUser, signedIn: true });
			},
			logOut: () => {
				set({ user: null, signedIn: false });
			},
		}),
		{
			name: 'mbh-user-storage', // name of item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
			partialize: (state) => ({ loggedInUser: state.user }),
		},
	),
);
