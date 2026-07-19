import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";
import { useUserStore } from "@/Store/userStore";

// ---------------------------------------------------------------------------
// Shared category config — same keys/palette as Mentors.jsx, mapped to the
// DB enum: singer, dancer, artist, designer, coder, photographer.
// ---------------------------------------------------------------------------
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

const SKILL_BADGE = {
    beginner: "bg-gray-100 text-gray-600",
    intermediate: "bg-sky-50 text-sky-700",
    advanced: "bg-violet-50 text-violet-700",
};

const ACHIEVEMENT_TYPE_ICON = {
    achievement: "🏅",
    award: "🏆",
    certification: "📜",
};

// ---------------------------------------------------------------------------
// Icon set — mirrors Mentors.jsx / CommunityDetail.jsx.
// ---------------------------------------------------------------------------
const Icon = {
    ArrowLeft: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    ),
    MapPin: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Star: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
    ),
    Users: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    MessageSquare: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
    ),
    UserPlus: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
        </svg>
    ),
    Clock: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    Send: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
        </svg>
    ),
};

// ---------------------------------------------------------------------------
// Mock data — shaped after users + user_profiles + achievements + videos +
// comments (reference_type='user_profile') tables. Tra theo `id` từ route,
// giống cách CommunityDetail.jsx tra theo id.
// ---------------------------------------------------------------------------
// TODO: thay bằng GET /api/mentors/:id (join user_profiles, achievements, videos, reviews).
const ALL_MENTORS = [
    {
        id: "m1",
        firstName: "Quang",
        lastName: "Huy",
        category: "singer",
        skillLevel: "advanced",
        province: "TP. Hồ Chí Minh",
        bio:
            "Vocal coach with 8 years training pop & R&B singers across Vietnam. I focus on breath control, pitch accuracy and stage presence. I've helped mentees land their first paid gigs and contest placements — happy to review covers and give honest, actionable notes.",
        expertise: ["Vocal technique", "Breath control", "Stage presence", "Cover arrangement"],
        yearsExperience: 8,
        responseTime: "Trong vòng 1 ngày",
        achievements: [
            { type: "certification", title: "Berklee Vocal Performance Certificate", issuer: "Berklee Online", year: 2019 },
            { type: "award", title: "Best Vocal Coach — Spotlight Awards", issuer: "Spotlight", year: 2023 },
        ],
        mentees: 24,
        rating: 4.9,
        reviewCount: 18,
        following: true,
    },
];

export default function MentorProfile({ id }) {
    const MENTOR = useMemo(() => ALL_MENTORS.find((m) => m.id === id) ?? ALL_MENTORS[0], [id]);
    const cfg = CATEGORY_CONFIG[MENTOR.category];

    const navigate = useNavigate();
    const { userInfo } = useUserStore();

    const [following, setFollowing] = useState(false);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [menteeCount, setMenteeCount] = useState(MENTOR.mentees);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageDraft, setMessageDraft] = useState("");
    const [messageSent, setMessageSent] = useState(false);

    // Initialize follow state from the real profile response (isFollowing).
    // isFollowing === null (anonymous) → treat as "not following".
    useEffect(() => {
        if (!id) return;
        let active = true;
        axiosClient
            .get(API.AXIOS_USER_GET_BY_ID.replace("{id}", id))
            .then((res) => {
                if (active) setFollowing(res.data.data?.isFollowing ?? false);
            })
            .catch(() => {
                /* keep default "not following" if the profile can't be loaded */
            });
        return () => { active = false; };
    }, [id]);

    const toggleFollow = async () => {
        // Guest guard: never call the API; send them to login first.
        if (!userInfo) {
            toast.info("Log in to follow mentors");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        if (isTogglingFollow) return;
        setIsTogglingFollow(true);
        try {
            const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", id));
            if (res.data.isSuccess) {
                // Only update state AFTER the server confirms.
                setMenteeCount((c) => c + (following ? -1 : 1));
                setFollowing((f) => !f);
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "Something went wrong"
                    : "Something went wrong"
            );
        } finally {
            setIsTogglingFollow(false);
        }
    };

    const sendMessage = () => {
        if (!messageDraft.trim()) return;
        setMessageSent(true);
        setMessageDraft("");
        setTimeout(() => {
            setMessageOpen(false);
            setMessageSent(false);
        }, 1200);
    };

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-5xl mx-auto">
                {/* Back link */}
                <button className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-5">
                    <Icon.ArrowLeft /> Mentors
                </button>

                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 flex-shrink-0">
                            {MENTOR.firstName.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-gray-900">
                                    {MENTOR.firstName} {MENTOR.lastName}
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                    {cfg.icon} {cfg.label}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${SKILL_BADGE[MENTOR.skillLevel]}`}>
                                    {MENTOR.skillLevel}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium flex-wrap">
                                <span className="inline-flex items-center gap-1">
                                    <Icon.MapPin /> {MENTOR.province}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Icon.Users /> {menteeCount} mentees
                                </span>
                                <span className="inline-flex items-center gap-1 text-amber-500">
                                    <Icon.Star /> <span className="text-gray-500">{MENTOR.rating.toFixed(1)} ({MENTOR.reviewCount} reviews)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMessageOpen(true)}
                            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Icon.MessageSquare /> Message
                        </button>
                        <button
                            onClick={toggleFollow}
                            disabled={isTogglingFollow}
                            className={`cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                                following ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            <Icon.UserPlus /> {following ? "Following" : "Follow"}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-5">{MENTOR.bio}</p>

                <div className="border-b border-gray-100 mb-6" />

                {/* Body: content + sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    <div className="min-w-0 space-y-5">
                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {MENTOR.expertise.map((e, i) => (
                                    <span key={i} className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Credentials</h3>
                            <div className="space-y-3">
                                {MENTOR.achievements.map((a, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-lg leading-none">{ACHIEVEMENT_TYPE_ICON[a.type]}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                                            <p className="text-xs text-gray-400">{a.issuer} · {a.year}</p>
                                        </div>
                                    </div>
                                ))}
                                {MENTOR.achievements.length === 0 && (
                                    <p className="text-sm text-gray-400">No credentials listed yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick info</h3>
                            <div className="space-y-2.5 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Icon.Clock style={{ color: "#9CA3AF" }} />
                                    <span>Responds {MENTOR.responseTime.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon.Users style={{ color: "#9CA3AF" }} />
                                    <span>{MENTOR.yearsExperience} years experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon.MapPin style={{ color: "#9CA3AF" }} />
                                    <span>{MENTOR.province}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Stats</h3>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div>
                                    <p className="text-lg font-extrabold text-gray-900">{menteeCount}</p>
                                    <p className="text-xs text-gray-400">Mentees</p>
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold text-gray-900">{MENTOR.rating.toFixed(1)}</p>
                                    <p className="text-xs text-gray-400">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message modal */}
            {messageOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setMessageOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-900">
                                Message {MENTOR.firstName} {MENTOR.lastName}
                            </h3>
                            <button onClick={() => setMessageOpen(false)} className="cursor-pointer text-gray-300 hover:text-gray-500 transition-colors" aria-label="Close">
                                ✕
                            </button>
                        </div>

                        {messageSent ? (
                            <p className="text-sm text-emerald-600 font-medium py-4 text-center">Message sent!</p>
                        ) : (
                            <>
                                <textarea
                                    value={messageDraft}
                                    onChange={(e) => setMessageDraft(e.target.value)}
                                    placeholder={`Say hi and share what you'd like feedback on...`}
                                    rows={4}
                                    className="w-full text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!messageDraft.trim()}
                                    className="cursor-pointer mt-3 w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon.Send /> Send message
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
