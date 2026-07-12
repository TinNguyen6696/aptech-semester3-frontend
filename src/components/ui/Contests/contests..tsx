import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const TODAY = new Date("2026-07-12");
const CATEGORY_CONFIG = {
    singer: {
        label: "Singer",
        badgeBg: "bg-amber-100",
        badgeColor: "text-amber-700",
        iconBg: "bg-amber-100",
        iconColor: "#B45309",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
            </svg>
        ),
    },
    dancer: {
        label: "Dancer",
        badgeBg: "bg-purple-100",
        badgeColor: "text-purple-700",
        iconBg: "bg-purple-100",
        iconColor: "#7C3AED",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        iconColor: "#BE123C",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        iconColor: "#047857",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19 7-7 3 3-7 7-3-3Z" />
                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
                <path d="m2 2 7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
            </svg>
        ),
    },
    coder: {
        label: "Coder",
        badgeBg: "bg-indigo-100",
        badgeColor: "text-indigo-700",
        iconBg: "bg-indigo-100",
        iconColor: "#4338CA",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
            </svg>
        ),
    },
    photographer: {
        label: "Photographer",
        badgeBg: "bg-blue-100",
        badgeColor: "text-blue-700",
        iconBg: "bg-blue-100",
        iconColor: "#1D4ED8",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
    },
};
const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG);

const STATUS_CONFIG = {
    upcoming: { label: "Upcoming", badgeBg: "bg-gray-100", badgeColor: "text-gray-600" },
    active: { label: "Voting open", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    ended: { label: "Ended", badgeBg: "bg-gray-100", badgeColor: "text-gray-400" },
};

function getStatus(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (TODAY < start) return "upcoming";
    if (TODAY > end) return "ended";
    return "active";
}

function daysLeft(endDate) {
    const diff = Math.ceil((new Date(endDate) - TODAY) / (1000 * 60 * 60 * 24));
    return diff;
}
const Icon = {
    Users: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
const MY_VIDEOS = [
    { id: "v1", title: "Acoustic cover — Rainy Nights", category: "singer" },
    { id: "v2", title: "Contemporary solo — Fragments", category: "dancer" },
    { id: "v3", title: "Golden hour portrait series", category: "photographer" },
];
const INITIAL_CONTESTS = [
    {
        id: "ct1",
        title: "60-Second Solo Vocal Challenge",
        category: "singer",
        description: "Submit a 60-second solo vocal performance, any genre. Community votes decide the top three.",
        startDate: "2026-07-01",
        endDate: "2026-07-20",
        createdBy: "Rhythm Collective",
        entries: [
            { id: "en1", videoTitle: "Rainy Nights (acoustic)", author: "Mai Lâm", votes: 128, votedByMe: true, mine: true },
            { id: "en2", videoTitle: "City Lights", author: "Thảo Vy", votes: 96, votedByMe: false, mine: false },
            { id: "en3", videoTitle: "Homebound", author: "Quang Huy", votes: 74, votedByMe: false, mine: false },
        ],
    },
    {
        id: "ct2",
        title: "Street Frame Photo Contest",
        category: "photographer",
        description: "One frame, one street, one story. Open to candid and staged street photography.",
        startDate: "2026-07-08",
        endDate: "2026-07-15",
        createdBy: "Frame & Focus",
        entries: [
            { id: "en4", videoTitle: "Golden hour portrait series", author: "You", votes: 41, votedByMe: false, mine: true },
            { id: "en5", videoTitle: "Rush Hour", author: "Trần Bảo", votes: 63, votedByMe: true, mine: false },
        ],
    },
    {
        id: "ct3",
        title: "Contemporary Choreography Showcase",
        category: "dancer",
        description: "Original contemporary routines, 2 minutes max. Winner gets a feature slot at the next Movement Lab meetup.",
        startDate: "2026-07-25",
        endDate: "2026-08-05",
        createdBy: "Movement Lab",
        entries: [],
    },
    {
        id: "ct4",
        title: "48-Hour UI Sprint",
        category: "designer",
        description: "Redesign a screen of your choice in 48 hours. Post your before/after and process shots.",
        startDate: "2026-06-10",
        endDate: "2026-06-25",
        createdBy: "Visual Grammar",
        entries: [
            { id: "en6", videoTitle: "Portfolio redesign walkthrough", author: "Đức Minh", votes: 152, votedByMe: false, mine: false },
        ],
    },
    {
        id: "ct5",
        title: "7-Day Build Challenge",
        category: "coder",
        description: "Ship a small project in a week and record a 3-minute demo walkthrough.",
        startDate: "2026-07-05",
        endDate: "2026-07-19",
        createdBy: "Reel Makers",
        entries: [
            { id: "en7", videoTitle: "Habit tracker demo", author: "Nam Khánh", votes: 34, votedByMe: false, mine: false },
        ],
    },
    {
        id: "ct6",
        title: "Watercolor Portrait Jam",
        category: "artist",
        description: "Paint a portrait in watercolor and share a timelapse of the process.",
        startDate: "2026-05-01",
        endDate: "2026-05-15",
        createdBy: "Inkwell Society",
        entries: [
            { id: "en8", videoTitle: "Grandmother, in watercolor", author: "Ngọc Anh", votes: 88, votedByMe: false, mine: false },
        ],
    },
];

export default function Contests(){
    const navigate = useNavigate();
    const [contests, setContests] = useState(INITIAL_CONTESTS);
        const [activeTab, setActiveTab] = useState("discover");
        const [searchQuery, setSearchQuery] = useState("");
        const [categoryFilter, setCategoryFilter] = useState(null);
    
        const [selectedId, setSelectedId] = useState(null);
        const [isCreateOpen, setIsCreateOpen] = useState(false);
        const [createForm, setCreateForm] = useState({ title: "", category: "", description: "", startDate: "", endDate: "" });
    
        const [isSubmitOpen, setIsSubmitOpen] = useState(false);
        const [pickedVideoId, setPickedVideoId] = useState(null);
    
        const selected = useMemo(() => contests.find((c) => c.id === selectedId) ?? null, [contests, selectedId]);
    
        const enriched = useMemo(
            () =>
                contests.map((c) => ({
                    ...c,
                    status: getStatus(c.startDate, c.endDate),
                    hasMyEntry: c.entries.some((e) => e.mine),
                })),
            [contests]
        );
    
        const filtered = useMemo(() => {
            return enriched
                .filter((c) => (activeTab === "mine" ? c.hasMyEntry : true))
                .filter((c) => (categoryFilter ? c.category === categoryFilter : true))
                .filter((c) =>
                    searchQuery.trim()
                        ? c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
                        : true
                )
                .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        }, [enriched, activeTab, categoryFilter, searchQuery]);
    
        const activeCount = enriched.filter((c) => c.status === "active").length;
        const myEntryCount = enriched.filter((c) => c.hasMyEntry).length;
        const votesCast = contests.reduce((sum, c) => sum + c.entries.filter((e) => e.votedByMe).length, 0);
    
        // -------------------------------------------------------------
        // Actions
        // -------------------------------------------------------------
        const toggleVote = (contestId, entryId) => {
            setContests((prev) =>
                prev.map((c) =>
                    c.id !== contestId
                        ? c
                        : {
                              ...c,
                              entries: c.entries.map((e) =>
                                  e.id === entryId
                                      ? { ...e, votedByMe: !e.votedByMe, votes: e.votes + (e.votedByMe ? -1 : 1) }
                                      : e
                              ),
                          }
                )
            );
        };
    
        const openDetail = (id) => {
            navigate({ to: "/contestDetail", search: { id } });
        };
        const closeDetail = () => setSelectedId(null);
    
        const submitContest = (e) => {
            e.preventDefault();
            if (!createForm.title.trim() || !createForm.category || !createForm.startDate || !createForm.endDate) return;
            const newContest = {
                id: `ct${Date.now()}`,
                title: createForm.title.trim(),
                category: createForm.category,
                description: createForm.description.trim(),
                startDate: createForm.startDate,
                endDate: createForm.endDate,
                createdBy: "You",
                entries: [],
            };
            setContests((prev) => [newContest, ...prev]);
            setCreateForm({ title: "", category: "", description: "", startDate: "", endDate: "" });
            setIsCreateOpen(false);
        };
    
        const submitEntry = () => {
            if (!pickedVideoId || !selected) return;
            const video = MY_VIDEOS.find((v) => v.id === pickedVideoId);
            if (!video) return;
            setContests((prev) =>
                prev.map((c) =>
                    c.id === selected.id
                        ? {
                              ...c,
                              entries: [
                                  { id: `en${Date.now()}`, videoTitle: video.title, author: "You", votes: 0, votedByMe: false, mine: true },
                                  ...c.entries,
                              ],
                          }
                        : c
                )
            );
            setPickedVideoId(null);
            setIsSubmitOpen(false);
        };
    
        const formatDate = (isoDate) =>
            new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
        const eligibleVideos = useMemo(
            () => (selected ? MY_VIDEOS.filter((v) => v.category === selected.category) : []),
            [selected]
        );
    
        const sortedEntries = useMemo(() => {
            if (!selected) return [];
            return [...selected.entries].sort((a, b) => b.votes - a.votes);
        }, [selected]);
    
        // -------------------------------------------------------------
        return (
            <section className="px-6 sm:px-10 lg:px-16 py-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Contests</h1>
                            <p className="text-sm text-gray-500 mt-1">Enter a challenge, vote for your favorites, get discovered.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            <Icon.Plus />
                            Create contest
                        </button>
                    </div>
    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-xl font-extrabold text-gray-900">{activeCount}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Voting open</p>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-xl font-extrabold text-gray-900">{myEntryCount}</p>
                            <p className="text-xs text-gray-400 mt-0.5">My entries</p>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-xl font-extrabold text-gray-900">{votesCast}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Votes cast</p>
                        </div>
                    </div>
    
                    {/* Tabs */}
                    <div className="flex items-center gap-1 border border-gray-100 rounded-lg p-1 w-fit mb-5">
                        {[
                            { id: "discover", label: "Discover" },
                            { id: "mine", label: "My entries" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`cursor-pointer px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                                    activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
    
                    {/* Search + category filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Icon.Search />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search contests"
                                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={() => setCategoryFilter(null)}
                                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                    categoryFilter === null ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                All
                            </button>
                            {CATEGORY_KEYS.map((key) => {
                                const cfg = CATEGORY_CONFIG[key];
                                const active = categoryFilter === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setCategoryFilter(active ? null : key)}
                                        className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                            active ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {cfg.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
    
                    {/* Contest grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((c) => {
                                const cfg = CATEGORY_CONFIG[c.category];
                                const st = STATUS_CONFIG[c.status];
                                const left = daysLeft(c.endDate);
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => openDetail(c.id)}
                                        className="cursor-pointer border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`w-10 h-10 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>{cfg.icon}</div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${st.badgeBg} ${st.badgeColor}`}>
                                                {st.label}
                                            </span>
                                        </div>
    
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
                                            <span className={`inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                                {cfg.label}
                                            </span>
                                        </div>
    
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{c.description}</p>
    
                                        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                                            <span className="inline-flex items-center gap-1">
                                                <Icon.Calendar /> {formatDate(c.startDate)} – {formatDate(c.endDate)}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Icon.Users /> {c.entries.length} entries
                                            </span>
                                        </div>
    
                                        <div className="mt-1 text-xs font-semibold">
                                            {c.status === "active" && (
                                                <span className="text-emerald-600">
                                                    {left === 0 ? "Ends today" : `${left} day${left === 1 ? "" : "s"} left to vote`}
                                                </span>
                                            )}
                                            {c.status === "upcoming" && <span className="text-gray-400">Opens {formatDate(c.startDate)}</span>}
                                            {c.status === "ended" && <span className="text-gray-400">Contest ended</span>}
                                            {c.hasMyEntry && <span className="text-blue-600 ml-2">· You entered</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <Icon.Trophy className="text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">
                                {activeTab === "mine" ? "You haven't entered any contests yet" : "No contests found"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {activeTab === "mine" ? "Discover a contest and submit one of your videos." : "Try a different search or category."}
                            </p>
                            {activeTab === "mine" && (
                                <button
                                    onClick={() => setActiveTab("discover")}
                                    className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                                >
                                    Discover contests
                                </button>
                            )}
                        </div>
                    )}
                </div>
    
                {/* ------------------------------------------------------ */}
                {/* Create contest modal                                    */}
                {/* ------------------------------------------------------ */}
                {isCreateOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsCreateOpen(false); }}
                    >
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="text-base font-bold text-gray-900">Create contest</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                    <Icon.X />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-5">Set a challenge and let the community submit and vote.</p>
    
                            <form onSubmit={submitContest} className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {CATEGORY_KEYS.map((key) => {
                                        const cfg = CATEGORY_CONFIG[key];
                                        const selectedCat = createForm.category === key;
                                        return (
                                            <button
                                                type="button"
                                                key={key}
                                                onClick={() => setCreateForm((f) => ({ ...f, category: key }))}
                                                className={`cursor-pointer rounded-lg border p-2.5 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                                                    selectedCat ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                <span style={selectedCat ? {} : { filter: "grayscale(1) opacity(0.6)" }}>{cfg.icon}</span>
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
    
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contest title</label>
                                    <input
                                        type="text"
                                        value={createForm.title}
                                        onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. 60-Second Solo Vocal Challenge"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
    
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="What should people submit? What are the rules?"
                                        rows={3}
                                        maxLength={200}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5 text-right">{createForm.description.length}/200</p>
                                </div>
    
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start date</label>
                                        <input
                                            type="date"
                                            value={createForm.startDate}
                                            onChange={(e) => setCreateForm((f) => ({ ...f, startDate: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">End date</label>
                                        <input
                                            type="date"
                                            value={createForm.endDate}
                                            onChange={(e) => setCreateForm((f) => ({ ...f, endDate: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!createForm.title.trim() || !createForm.category || !createForm.startDate || !createForm.endDate}
                                        className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create contest
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
    
                {/* ------------------------------------------------------ */}
                {/* Contest detail modal                                    */}
                {/* ------------------------------------------------------ */}
                {selected && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
                    >
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="p-6 pb-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-12 h-12 rounded-xl ${CATEGORY_CONFIG[selected.category].iconBg} flex items-center justify-center`}>
                                            {CATEGORY_CONFIG[selected.category].icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">{selected.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_CONFIG[selected.category].badgeBg} ${CATEGORY_CONFIG[selected.category].badgeColor}`}>
                                                    {CATEGORY_CONFIG[selected.category].label}
                                                </span>
                                                {(() => {
                                                    const st = STATUS_CONFIG[getStatus(selected.startDate, selected.endDate)];
                                                    return (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.badgeBg} ${st.badgeColor}`}>
                                                            {st.label}
                                                        </span>
                                                    );
                                                })()}
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                    <Icon.Calendar /> {formatDate(selected.startDate)} – {formatDate(selected.endDate)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1.5">Hosted by {selected.createdBy}</p>
                                        </div>
                                    </div>
                                    <button onClick={closeDetail} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                        <Icon.X />
                                    </button>
                                </div>
    
                                <p className="text-sm text-gray-500 mt-4 leading-relaxed">{selected.description}</p>
    
                                <div className="flex items-center justify-between mt-5 pb-5 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900">
                                        Entries <span className="text-gray-400 font-medium">({selected.entries.length})</span>
                                    </p>
                                    {getStatus(selected.startDate, selected.endDate) === "active" &&
                                        (selected.hasMyEntry ? (
                                            <span className="text-xs font-semibold text-blue-600">You've already entered</span>
                                        ) : (
                                            <button
                                                onClick={() => setIsSubmitOpen(true)}
                                                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                            >
                                                <Icon.Plus /> Submit entry
                                            </button>
                                        ))}
                                </div>
                            </div>
    
                            {/* Entries list, ranked by votes */}
                            <div className="p-6 pt-5 space-y-3">
                                {sortedEntries.length > 0 ? (
                                    sortedEntries.map((entry, i) => (
                                        <div key={entry.id} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                                            <div className="flex-shrink-0 w-6 text-center">
                                                {i === 0 ? (
                                                    <Icon.Crown className="text-amber-500 mx-auto" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-300">#{i + 1}</span>
                                                )}
                                            </div>
    
                                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <Icon.Play />
                                            </div>
    
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{entry.videoTitle}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {entry.mine ? "Your entry" : entry.author}
                                                </p>
                                            </div>
    
                                            <button
                                                onClick={() => toggleVote(selected.id, entry.id)}
                                                disabled={entry.mine}
                                                className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg border font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    entry.votedByMe
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                                                }`}
                                                aria-label={entry.votedByMe ? "Remove vote" : "Vote"}
                                            >
                                                <Icon.ChevronUp />
                                                <span className="text-xs">{entry.votes}</span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-6 text-gray-500 border border-dashed rounded-xl text-sm">
                                        No entries yet. Be the first to submit.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
    
                {/* ------------------------------------------------------ */}
                {/* Submit entry modal (pick from my videos in category)     */}
                {/* ------------------------------------------------------ */}
                {isSubmitOpen && selected && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsSubmitOpen(false); }}
                    >
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="text-base font-bold text-gray-900">Submit entry</h3>
                                <button onClick={() => setIsSubmitOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                    <Icon.X />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-5">Pick one of your {CATEGORY_CONFIG[selected.category].label.toLowerCase()} videos for "{selected.title}".</p>
    
                            {eligibleVideos.length > 0 ? (
                                <div className="space-y-2">
                                    {eligibleVideos.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setPickedVideoId(v.id)}
                                            className={`cursor-pointer w-full text-left rounded-lg border px-3 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors ${
                                                pickedVideoId === v.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <Icon.Play className="text-gray-400 flex-shrink-0" />
                                            {v.title}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 text-gray-500 border border-dashed rounded-xl text-sm">
                                    You don't have any {CATEGORY_CONFIG[selected.category].label.toLowerCase()} videos yet. Upload one from My Videos first.
                                </div>
                            )}
    
                            <div className="flex justify-end gap-2.5 pt-5 mt-5 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsSubmitOpen(false)}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitEntry}
                                    disabled={!pickedVideoId}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit entry
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
}