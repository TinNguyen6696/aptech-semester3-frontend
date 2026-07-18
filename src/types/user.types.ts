export type UserRole = "Member" | "Mentor" | "Recruiter" | "Admin";

export interface UserInfo {
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
    role: UserRole;
}

export interface UserStore {
    userInfo: UserInfo | null;
    setUserInfo: (user: UserInfo) => void;
    updateUserInfo: (partial: Partial<UserInfo>) => void;
    clearUserInfo: () => void;
}
