const TODAY = new Date();
export const CATEGORY_PALETTE = [
    { badgeBg: "bg-purple-100", badgeColor: "text-purple-700", iconBg: "bg-purple-100", iconColor: "#7C3AED" },
    { badgeBg: "bg-amber-100", badgeColor: "text-amber-700", iconBg: "bg-amber-100", iconColor: "#B45309" },
    { badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700", iconBg: "bg-emerald-100", iconColor: "#047857" },
    { badgeBg: "bg-blue-100", badgeColor: "text-blue-700", iconBg: "bg-blue-100", iconColor: "#1D4ED8" },
    { badgeBg: "bg-orange-100", badgeColor: "text-orange-700", iconBg: "bg-orange-100", iconColor: "#C2410C" },
    { badgeBg: "bg-rose-100", badgeColor: "text-rose-700", iconBg: "bg-rose-100", iconColor: "#BE123C" },
];
const KNOWN_CATEGORY_STYLES: Record<string, { badgeBg: string; badgeColor: string; iconBg: string; iconColor: string }> = {
    singer:       { badgeBg: "bg-amber-100",   badgeColor: "text-amber-700",   iconBg: "bg-amber-100",   iconColor: "#B45309" },
    dancer:       { badgeBg: "bg-purple-100",  badgeColor: "text-purple-700",  iconBg: "bg-purple-100",  iconColor: "#7C3AED" },
    artist:       { badgeBg: "bg-rose-100",    badgeColor: "text-rose-700",    iconBg: "bg-rose-100",    iconColor: "#BE123C" },
    designer:     { badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700", iconBg: "bg-emerald-100", iconColor: "#047857" },
    coder:        { badgeBg: "bg-indigo-100",  badgeColor: "text-indigo-700",  iconBg: "bg-indigo-100",  iconColor: "#4338CA" },
    photographer: { badgeBg: "bg-blue-100",    badgeColor: "text-blue-700",    iconBg: "bg-blue-100",    iconColor: "#1D4ED8" },
};

export const CATEGORY_CONFIG_CONTEST_DETAIL = {
    singer: { label: "Singer", badgeBg: "bg-amber-100", badgeColor: "text-amber-700" },
    dancer: { label: "Dancer", badgeBg: "bg-purple-100", badgeColor: "text-purple-700" },
    artist: { label: "Artist", badgeBg: "bg-rose-100", badgeColor: "text-rose-700" },
    designer: { label: "Designer", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    coder: { label: "Coder", badgeBg: "bg-indigo-100", badgeColor: "text-indigo-700" },
    photographer: { label: "Photographer", badgeBg: "bg-blue-100", badgeColor: "text-blue-700" },
};

const GenericCategoryIcon = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
    </svg>
);

export const CATEGORY_ICON_SHAPES = {
    singer: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    ),
    dancer: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v6l-4 8M12 12l4 8M8 10l-3 3M16 10l3 3" />
        </svg>
    ),
    artist: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a9.5 9.5 0 1 1 0-19c4.42 0 8.5 2.87 8.5 7 0 2.21-1.79 3.5-3.5 3.5h-2a1.5 1.5 0 0 0-1 2.6c.4.36.6.8.6 1.4 0 1.38-1.12 2.5-2.6 2.5Z" />
            <circle cx="7.5" cy="10.5" r="1" fill={color} />
            <circle cx="10.5" cy="7" r="1" fill={color} />
            <circle cx="15" cy="7.5" r="1" fill={color} />
        </svg>
    ),
    designer: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    ),
    coder: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    photographer: ({ color }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
};

export const resolveCategoryIcon = (key, color) => {
    const Shape = CATEGORY_ICON_SHAPES[key];
    return Shape ? <Shape color={color} /> : <GenericCategoryIcon color={color} />;
};

export const FALLBACK_CATEGORY_CONFIG = {
    label: "Other",
    badgeBg: "bg-gray-100",
    badgeColor: "text-gray-700",
    iconBg: "bg-gray-100",
    icon: <GenericCategoryIcon color="#6B7280" />,
};

export const normalizeCategoryKey = (label) =>
    typeof label === "string" ? label.toLowerCase().trim() : label;

export const getSingleCategoryConfig = (category) => {
    if (!category) return FALLBACK_CATEGORY_CONFIG;
    const key = normalizeCategoryKey(category);

    const known = KNOWN_CATEGORY_STYLES[key];
    const palette = known ?? (() => {
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
        return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    })();

    return {
        key,
        label: category,
        ...palette,
        icon: resolveCategoryIcon(key, palette.iconColor),
    };
};

export const buildCategoryConfig = (communityList) => {
    const map = {};
    communityList.forEach((c) => {
        const key = normalizeCategoryKey(c.category);
        if (map[key]) return;
        map[key] = getSingleCategoryConfig(c.category);
    });
    return map;
};

export const STATUS_CONFIG = {
    upcoming: { label: "Upcoming", badgeBg: "bg-gray-100", badgeColor: "text-gray-600" },
    active: { label: "Voting open", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    ended: { label: "Ended", badgeBg: "bg-gray-100", badgeColor: "text-gray-400" },
};

export const getStatus = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (TODAY < start) return "upcoming";
    if (TODAY > end) return "ended";
    return "active";
}
export function daysLeft(endDate) {
    const diff = Math.ceil((new Date(endDate) - TODAY) / (1000 * 60 * 60 * 24));
    return diff;
}

export const Icon = {
    Users: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    MoreVertical: (props) => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    ),
    Calendar: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
    Trophy: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
            <path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4" />
        </svg>
    ),
    Search: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    ),
    Plus: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    X: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    ),
    ChevronUp: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m18 15-6-6-6 6" />
        </svg>
    ),
    ChevronLeft: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    ),
    ChevronRight: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    ),
    Play: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5v14l11-7Z" />
        </svg>
    ),
    Crown: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m2 20 2-11 5 4 3-7 3 7 5-4 2 11Z" />
        </svg>
    ),
};

export const IconContestDetail = {
    ChevronUp: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m18 15-6-6-6 6" />
        </svg>
    ),
    Play: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5v14l11-7Z" />
        </svg>
    ),
    Crown: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m2 20 2-11 5 4 3-7 3 7 5-4 2 11Z" />
        </svg>
    ),
    Calendar: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
    Users: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    ArrowLeft: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m12 19-7-7 7-7M5 12h14" />
        </svg>
    ),
    Flame: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 22c4.5 0 7-3 7-6.5 0-2.5-1.5-4-2.5-5.5-.3 1.5-1 2-1.5 2 .5-3-1-5.5-3.5-7 .3 2-.3 3.5-1.5 4.5C8.5 10.5 7 12 7 15.5 7 19 9.5 22 12 22Z" />
        </svg>
    ),
    Close: (props) => (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            {...props}
        >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
        </svg>
    ),
    Expand: (props) => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
    ),
    Pause: (props) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    ),
    VolumeOn: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
    ),

    VolumeOff: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
    ),
    Trash: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
    ),
    Check: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    ),
};
export const RANK_STYLE = {
    1: { ring: "ring-amber-400", chip: "bg-amber-500 text-white", label: "#1" },
    2: { ring: "ring-gray-300", chip: "bg-gray-400 text-white", label: "#2" },
    3: { ring: "ring-orange-300", chip: "bg-orange-400 text-white", label: "#3" },
};

export const CATEGORY_CONFIG_DETAIL = {
    singer: { label: "Singer", badgeBg: "bg-amber-100", badgeColor: "text-amber-700" },
    dancer: { label: "Dancer", badgeBg: "bg-purple-100", badgeColor: "text-purple-700" },
    artist: { label: "Artist", badgeBg: "bg-rose-100", badgeColor: "text-rose-700" },
    designer: { label: "Designer", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    coder: { label: "Coder", badgeBg: "bg-indigo-100", badgeColor: "text-indigo-700" },
    photographer: { label: "Photographer", badgeBg: "bg-blue-100", badgeColor: "text-blue-700" },
} as const;