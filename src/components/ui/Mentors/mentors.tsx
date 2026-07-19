import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useUserStore } from "@/Store/userStore";

const CATEGORY_CONFIG = {
    singer: {
        label: "Singer",
        badgeBg: "bg-amber-100",
        badgeColor: "text-amber-700",
        iconBg: "bg-amber-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    dancer: {
        label: "Dancer",
        badgeBg: "bg-purple-100",
        badgeColor: "text-purple-700",
        iconBg: "bg-purple-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4" r="2" />
                <path d="M12 6v6l-4 8M12 12l4 8M8 10l-3 3M16 10l3 3" />
            </svg>
        ),
    },
    artist: {
        label: "Artist",
        badgeBg: "bg-rose-100",
        badgeColor: "text-rose-700",
        iconBg: "bg-rose-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a9.5 9.5 0 1 1 0-19c4.42 0 8.5 2.87 8.5 7 0 2.21-1.79 3.5-3.5 3.5h-2a1.5 1.5 0 0 0-1 2.6c.4.36.6.8.6 1.4 0 1.38-1.12 2.5-2.6 2.5Z" />
                <circle cx="7.5" cy="10.5" r="1" fill="#BE123C" />
                <circle cx="10.5" cy="7" r="1" fill="#BE123C" />
                <circle cx="15" cy="7.5" r="1" fill="#BE123C" />
            </svg>
        ),
    },
    designer: {
        label: "Designer",
        badgeBg: "bg-emerald-100",
        badgeColor: "text-emerald-700",
        iconBg: "bg-emerald-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
            </svg>
        ),
    },
    coder: {
        label: "Coder",
        badgeBg: "bg-blue-100",
        badgeColor: "text-blue-700",
        iconBg: "bg-blue-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    photographer: {
        label: "Photographer",
        badgeBg: "bg-indigo-100",
        badgeColor: "text-indigo-700",
        iconBg: "bg-indigo-100",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
    },
};

const SKILL_LEVELS = ["beginner", "intermediate", "advanced"];

// ---------------------------------------------------------------------------
// Icon set — mirrors Communities.jsx / CommunityDetail.jsx, extended with a
// few icons needed for search/filter/mentor cards.
// ---------------------------------------------------------------------------
const Icon = {
    Search: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    ),
    MapPin: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Star: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
    ),
    Award: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="8" r="6" />
            <path d="M8.2 13.5 6 22l6-3 6 3-2.2-8.5" />
        </svg>
    ),
    UserPlus: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
        </svg>
    ),
    ChevronDown: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
};

const SKILL_BADGE = {
    beginner: "bg-gray-100 text-gray-600",
    intermediate: "bg-sky-50 text-sky-700",
    advanced: "bg-violet-50 text-violet-700",
};

// ---------------------------------------------------------------------------
// Mock data — shaped after the DB schema: users (role='mentor') + user_profiles
// + achievements, joined the way the API would return them.
// ---------------------------------------------------------------------------
// TODO: thay bằng dữ liệu thật từ GET /api/users?role=mentor (React Query / API).
const MENTORS = [
    {
        id: "m1",
        firstName: "Quang",
        lastName: "Huy",
        category: "singer",
        skillLevel: "advanced",
        province: "TP. Hồ Chí Minh",
        bio: "Vocal coach with 8 years training pop & R&B singers. I focus on breath control, pitch and stage presence — happy to review covers and give honest, actionable notes.",
        achievements: [{ type: "certification", title: "Berklee Vocal Performance Certificate" }],
        mentees: 24,
        rating: 4.9,
        following: true,
    },
    {
        id: "m2",
        firstName: "Thu",
        lastName: "Hà",
        category: "dancer",
        skillLevel: "advanced",
        province: "Hà Nội",
        bio: "Contemporary & hip-hop choreographer. I mentor dancers preparing contest entries — musicality, formation and camera-ready performance quality.",
        achievements: [{ type: "award", title: "National Dance Championship — 1st place" }],
        mentees: 31,
        rating: 5.0,
        following: false,
    },
    {
        id: "m3",
        firstName: "Minh",
        lastName: "Đức",
        category: "coder",
        skillLevel: "advanced",
        province: "Đà Nẵng",
        bio: "Senior frontend engineer mentoring beginner-to-intermediate coders on portfolio projects, code reviews, and interview prep.",
        achievements: [{ type: "certification", title: "AWS Certified Solutions Architect" }],
        mentees: 42,
        rating: 4.8,
        following: false,
    },
    {
        id: "m4",
        firstName: "Bảo",
        lastName: "Trân",
        category: "artist",
        skillLevel: "intermediate",
        province: "TP. Hồ Chí Minh",
        bio: "Watercolor & gouache painter. I give feedback on composition and color theory, and run monthly critique sessions for the community.",
        achievements: [],
        mentees: 12,
        rating: 4.7,
        following: false,
    },
    {
        id: "m5",
        firstName: "Anh",
        lastName: "Tuấn",
        category: "photographer",
        skillLevel: "advanced",
        province: "Hà Nội",
        bio: "Portrait & street photographer for 10+ years. Mentoring on lighting, editing workflow, and building a portfolio that gets noticed by agencies.",
        achievements: [{ type: "achievement", title: "Featured in National Geographic VN" }],
        mentees: 19,
        rating: 4.9,
        following: true,
    },
    {
        id: "m6",
        firstName: "Ngọc",
        lastName: "Hân",
        category: "designer",
        skillLevel: "advanced",
        province: "TP. Hồ Chí Minh",
        bio: "Brand & UI designer. I review portfolios, run mock client critiques, and help mentees prepare case studies for design job applications.",
        achievements: [{ type: "certification", title: "Google UX Design Certificate" }],
        mentees: 27,
        rating: 4.8,
        following: false,
    },
];

const CATEGORY_FILTERS = [{ id: "all", label: "All talents" }, ...Object.entries(CATEGORY_CONFIG).map(([id, c]) => ({ id, label: c.label }))];

export default function Mentors() {
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [skillLevel, setSkillLevel] = useState("all");
    const [following, setFollowing] = useState(() => new Set(MENTORS.filter((m) => m.following).map((m) => m.id)));

    const goToProfile = (id) => {
        navigate({ to: "/mentorProfile", search: { id } });
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return MENTORS.filter((m) => {
            const matchesQuery =
                !q ||
                `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
                m.bio.toLowerCase().includes(q);
            const matchesCategory = category === "all" || m.category === category;
            const matchesSkill = skillLevel === "all" || m.skillLevel === skillLevel;
            return matchesQuery && matchesCategory && matchesSkill;
        });
    }, [query, category, skillLevel]);

    const toggleFollow = (id) => {
        // Guest guard: don't toggle anything; send them to login first.
        if (!userInfo) {
            toast.info("Log in to follow mentors");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        // NOTE: still mock — real POST /users/{id}/follow is a follow-up,
        // blocked by the missing mentor-list endpoint (list ids are placeholders).
        setFollowing((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const MentorCard = ({ m }) => {
        const cfg = CATEGORY_CONFIG[m.category];
        const isFollowing = following.has(m.id);
        return (
            <div
                onClick={() => goToProfile(m.id)}
                className="cursor-pointer border border-gray-100 rounded-xl p-4 flex flex-col hover:border-gray-200 hover:shadow-sm transition-all"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                            {m.firstName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {m.firstName} {m.lastName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <Icon.MapPin /> {m.province}
                            </div>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${cfg.badgeBg} ${cfg.badgeColor}`}>
                        {cfg.icon} {cfg.label}
                    </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mt-3 line-clamp-3">{m.bio}</p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${SKILL_BADGE[m.skillLevel]}`}>
                        {m.skillLevel}
                    </span>
                    {m.achievements.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                            <Icon.Award /> {m.achievements.length} credential{m.achievements.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 font-medium">
                    <span className="inline-flex items-center gap-1">
                        <Icon.Star style={{ color: "#F59E0B" }} /> {m.rating.toFixed(1)}
                    </span>
                    <span>{m.mentees} mentees</span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => goToProfile(m.id)}
                        className="cursor-pointer flex-1 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View profile
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(m.id);
                        }}
                        className={`cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                            isFollowing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        <Icon.UserPlus /> {isFollowing ? "Following" : "Follow"}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Icon.Award /> Mentorship &amp; guidance
                    </span>
                    <h1 className="mt-4 text-2xl sm:text-[28px] font-extrabold text-gray-900">Find a mentor</h1>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl leading-relaxed">
                        Connect with experienced creators and industry professionals for feedback, guidance, and career advice across every talent category.
                    </p>
                </div>

                {/* Search + filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                    <div className="relative flex-1 max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon.Search />
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search mentors by name or expertise"
                            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                            className="cursor-pointer appearance-none rounded-lg border border-gray-200 pl-3 pr-8 py-2.5 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        >
                            <option value="all">All skill levels</option>
                            {SKILL_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl} className="capitalize">
                                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon.ChevronDown />
                        </span>
                    </div>
                </div>

                {/* Category chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
                    {CATEGORY_FILTERS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={`cursor-pointer whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                                category === c.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <p className="text-xs text-gray-400 font-medium mb-4">{filtered.length} mentors found</p>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((m) => (
                            <MentorCard key={m.id} m={m} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-14 text-gray-500 border border-dashed rounded-xl text-sm">
                        No mentors match your filters. Try a different category or search term.
                    </div>
                )}
            </div>
        </section>
    );
}
