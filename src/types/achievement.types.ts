import type { JSX } from "react";

export interface AchievementTypeConfig {
    label: string;
    badgeBg: string;
    badgeColor: string;
    iconBg: string;
    iconColor: string;
    icon: JSX.Element;
}

export interface Achievement {
    id: string;
    type: string;
    title: string;
    issuer: string;
    issuedDate: string;
    description: string;
    externalUrl?: string;
    certificateUrl?: string;
    hasCertificate?: boolean;
}

export interface AchievementFormValues {
    type: string;
    title: string;
    issuer: string;
    issuedDate: string;
    description: string;
    externalUrl: string;
    certificateImage:File | null;
}