import type { MouseEvent } from "react";
import { API } from "@/lib/apiendpoint";

interface UserAvatarProps {
    profileImageUrl?: string | null;
    /** Overrides the computed image src (e.g. a local blob preview before upload completes). */
    src?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    size?: number;
    className?: string;
    onClick?: (e: MouseEvent) => void;
}

function getInitials(firstName?: string | null, lastName?: string | null, username?: string | null) {
    const a = firstName?.trim()?.charAt(0) ?? "";
    const b = lastName?.trim()?.charAt(0) ?? "";
    const fromName = (a + b).toUpperCase();
    if (fromName) return fromName;
    return (username?.trim()?.slice(0, 2) ?? "").toUpperCase() || "?";
}

export default function UserAvatar({ profileImageUrl, src, firstName, lastName, username, size = 36, className = "", onClick }: UserAvatarProps) {
    const imgSrc = src || (profileImageUrl ? `${API.URL}${profileImageUrl}` : null);
    if (imgSrc) {
        return (
            <img
                src={imgSrc}
                alt={username || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "avatar"}
                onClick={onClick}
                className={`rounded-full object-cover flex-shrink-0 ${onClick ? "cursor-pointer" : ""} ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <span
            onClick={onClick}
            className={`rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 ${onClick ? "cursor-pointer" : ""} ${className}`}
            style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}
        >
            {getInitials(firstName, lastName, username)}
        </span>
    );
}
