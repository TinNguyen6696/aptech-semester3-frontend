import { create } from 'zustand';
import { StringValue } from '@/lib/stringValue';

interface UserInfo {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profileImageUrl: string;
    provinceId: number;
    provinceName: string;
    primaryCategory: string;
    skillLevel: string;
    role: string;
}

interface UserStore {
    userInfo: UserInfo | null;
    setUserInfo: (user: UserInfo) => void;
    updateUserInfo: (partial: Partial<UserInfo>) => void;
    clearUserInfo: () => void;
}

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