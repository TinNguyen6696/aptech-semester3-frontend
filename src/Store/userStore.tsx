import { create } from 'zustand';
import { StringValue } from '@/lib/stringValue';

import type { UserInfo, UserStore } from '@/types/user.types';

const getStoredUser = (): UserInfo | null => {
    try {
        const saved = localStorage.getItem(StringValue.USER_INFO);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};
export const useUserStore = create<UserStore>((set) => ({
    userInfo: getStoredUser(),

    setUserInfo: (user) => {
        localStorage.setItem(StringValue.USER_INFO, JSON.stringify(user));
        set({ userInfo: user });
    },

    updateUserInfo: (partial) => {
        set((state) => {
            const updated = { ...state.userInfo, ...partial } as UserInfo;
            localStorage.setItem(StringValue.USER_INFO, JSON.stringify(updated));
            return { userInfo: updated };
        });
    },

    clearUserInfo: () => {
        localStorage.removeItem(StringValue.USER_INFO);
        set({ userInfo: null });
    },
}));