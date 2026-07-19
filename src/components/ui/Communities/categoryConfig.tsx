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
