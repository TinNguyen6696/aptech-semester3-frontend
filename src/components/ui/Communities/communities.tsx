import { useMemo, useState } from "react";
// 1) Import điều hướng từ TanStack Router
import { useNavigate } from "@tanstack/react-router";

const CATEGORY_CONFIG = {
    musicians: {
        label: "Musicians",
        badgeBg: "bg-amber-100",
        badgeColor: "text-amber-700",
        iconBg: "bg-amber-100",
        iconColor: "#B45309",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    dancers: {
        label: "Dancers",
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
    photographers: {
        label: "Photographers",
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
    writers: {
        label: "Writers",
        badgeBg: "bg-rose-100",
        badgeColor: "text-rose-700",
        iconBg: "bg-rose-100",
        iconColor: "#BE123C",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
        ),
    },
    filmmakers: {
        label: "Filmmakers",
        badgeBg: "bg-indigo-100",
        badgeColor: "text-indigo-700",
        iconBg: "bg-indigo-100",
        iconColor: "#4338CA",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <path d="M6 6 4 2M12 6l-2-4M18 6l-2-4" />
            </svg>
        ),
    },
    designers: {
        label: "Designers",
        badgeBg: "bg-emerald-100",
        badgeColor: "text-emerald-700",
        iconBg: "bg-emerald-100",
        iconColor: "#047857",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a9.5 9.5 0 1 1 0-19c4.42 0 8.5 2.87 8.5 7 0 2.21-1.79 3.5-3.5 3.5h-2a1.5 1.5 0 0 0-1 2.6c.4.36.6.8.6 1.4 0 1.38-1.12 2.5-2.6 2.5Z" />
                <circle cx="7.5" cy="10.5" r="1" fill="#047857" />
                <circle cx="10.5" cy="7" r="1" fill="#047857" />
                <circle cx="15" cy="7.5" r="1" fill="#047857" />
            </svg>
        ),
    },
};
const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG);
const Icon = {
    Users: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
    Calendar: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
    Lock: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    Globe: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
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
};
const INITIAL_COMMUNITIES = [
    {
        id: "c1",
        name: "Rhythm Collective",
        category: "musicians",
        isPrivate: false,
        description: "For instrumentalists, singers and producers who want honest feedback and jam-session buddies.",
        memberCount: 342,
        joined: true,
        postsThisWeek: 18,
        posts: [
            { id: "p1", author: "Mai Lâm", time: "2h ago", text: "Dropped a new acoustic cover — would love a critique on the bridge section before I record the final take.", likes: 12, comments: 4 },
            { id: "p2", author: "Quang Huy", time: "1d ago", text: "Anyone free to jam this Saturday? Looking for a bassist and a drummer near District 1.", likes: 7, comments: 9 },
        ],
        events: [
            { id: "e1", title: "Open Mic Night", date: "2026-07-18", location: "The Attic Café, District 3", online: false, attendees: 41 },
            { id: "e2", title: "Home Studio Mixing Workshop", date: "2026-07-25", location: "Online", online: true, attendees: 88 },
        ],
    },
    {
        id: "c2",
        name: "Frame & Focus",
        category: "photographers",
        isPrivate: false,
        description: "Street, portrait and product photographers sharing shoots, gear reviews and editing tricks.",
        memberCount: 218,
        joined: false,
        postsThisWeek: 9,
        posts: [
            { id: "p3", author: "Trần Bảo", time: "5h ago", text: "Golden hour at Thu Thiem bridge yesterday — swipe for the before/after edit.", likes: 24, comments: 3 },
        ],
        events: [
            { id: "e3", title: "Sunrise Street Walk", date: "2026-07-20", location: "Nguyen Hue Walking Street", online: false, attendees: 15 },
        ],
    },
    {
        id: "c3",
        name: "Movement Lab",
        category: "dancers",
        isPrivate: true,
        description: "A members-only space for choreographers to workshop routines and trade rehearsal footage.",
        memberCount: 96,
        joined: true,
        postsThisWeek: 6,
        posts: [
            { id: "p4", author: "Ngọc Anh", time: "3h ago", text: "Uploaded the count sheet for the contemporary piece — practice room B is booked Thursday 7-9pm.", likes: 5, comments: 2 },
        ],
        events: [
            { id: "e4", title: "Choreography Showcase Rehearsal", date: "2026-07-22", location: "Studio 4, Bình Thạnh", online: false, attendees: 22 },
        ],
    },
    {
        id: "c4",
        name: "Inkwell Society",
        category: "writers",
        isPrivate: false,
        description: "Poets, screenwriters and novelists exchanging drafts, prompts and publishing advice.",
        memberCount: 154,
        joined: false,
        postsThisWeek: 11,
        posts: [],
        events: [
            { id: "e5", title: "Flash Fiction Night", date: "2026-07-19", location: "Online", online: true, attendees: 34 },
        ],
    },
    {
        id: "c5",
        name: "Reel Makers",
        category: "filmmakers",
        isPrivate: false,
        description: "Short-film crews looking for collaborators, locations and honest rough-cut feedback.",
        memberCount: 87,
        joined: false,
        postsThisWeek: 4,
        posts: [],
        events: [],
    },
    {
        id: "c6",
        name: "Visual Grammar",
        category: "designers",
        isPrivate: true,
        description: "Graphic and motion designers critiquing portfolios and sharing freelance leads.",
        memberCount: 133,
        joined: true,
        postsThisWeek: 14,
        posts: [
            { id: "p5", author: "Đức Minh", time: "10h ago", text: "Redesigned my portfolio site over the weekend — feedback on the case-study layout welcome!", likes: 19, comments: 6 },
        ],
        events: [],
    },
];

export default function Communities() {
    const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
    const [activeTab, setActiveTab] = useState("discover"); // 'discover' | 'mine'
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", category: "", description: "", isPrivate: false });

    // 2) Hook điều hướng — gọi navigate(path) bất cứ đâu để chuyển trang
    const navigate = useNavigate();

    const filtered = useMemo(() => {
        return communities
            .filter((c) => (activeTab === "mine" ? c.joined : true))
            .filter((c) => (categoryFilter ? c.category === categoryFilter : true))
            .filter((c) =>
                searchQuery.trim()
                    ? c.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                      c.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
                    : true
            );
    }, [communities, activeTab, categoryFilter, searchQuery]);

    const joinedCount = communities.filter((c) => c.joined).length;
    const totalMembers = communities.reduce((sum, c) => sum + c.memberCount, 0);
    const activeDiscussions = communities.filter((c) => c.postsThisWeek > 0).length;

    // -------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------
    const toggleJoin = (id) => {
        setCommunities((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, joined: !c.joined, memberCount: c.memberCount + (c.joined ? -1 : 1) }
                    : c
            )
        );
    };

    // 3) Thay openDetail(id) (mở modal) bằng điều hướng sang route chi tiết,
    // theo đúng pattern bạn đang dùng cho contestDetail: truyền id qua search param.
    const goToCommunity = (id) => {
        navigate({ to: "/communityDetail", search: { id } });
    };

    const submitCommunity = (e) => {
        e.preventDefault();
        if (!createForm.name.trim() || !createForm.category) return;
        const newCommunity = {
            id: `c${Date.now()}`,
            name: createForm.name.trim(),
            category: createForm.category,
            isPrivate: createForm.isPrivate,
            description: createForm.description.trim(),
            memberCount: 1,
            joined: true,
            postsThisWeek: 0,
            posts: [],
            events: [],
        };
        setCommunities((prev) => [newCommunity, ...prev]);
        setCreateForm({ name: "", category: "", description: "", isPrivate: false });
        setIsCreateOpen(false);
        setActiveTab("mine");
    };

    // -------------------------------------------------------------
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Find your people — musicians, dancers, photographers and more.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        <Icon.Plus />
                        Create community
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                    <div className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xl font-extrabold text-gray-900">{joinedCount}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Joined</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xl font-extrabold text-gray-900">{totalMembers.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Total members</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xl font-extrabold text-gray-900">{activeDiscussions}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Active discussions</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border border-gray-100 rounded-lg p-1 w-fit mb-5">
                    {[
                        { id: "discover", label: "Discover" },
                        { id: "mine", label: "My communities" },
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
                            placeholder="Search communities"
                            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setCategoryFilter(null)}
                            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                categoryFilter === null
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
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
                                        active
                                            ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent`
                                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Community grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((c) => {
                            const cfg = CATEGORY_CONFIG[c.category];
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => goToCommunity(c.id)}
                                    className="cursor-pointer border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className={`w-10 h-10 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
                                            {cfg.icon}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                                            {c.isPrivate ? <Icon.Lock /> : <Icon.Globe />}
                                            {c.isPrivate ? "Private" : "Public"}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
                                        <span className={`inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{c.description}</p>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                                        <span className="inline-flex items-center gap-1">
                                            <Icon.Users /> {c.memberCount.toLocaleString()}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Icon.MessageSquare /> {c.postsThisWeek} this week
                                        </span>
                                        {c.events.length > 0 && (
                                            <span className="inline-flex items-center gap-1">
                                                <Icon.Calendar /> {c.events.length}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            // Chặn sự kiện click nổi lên div cha (để không bị điều hướng khi chỉ muốn Join)
                                            e.stopPropagation();
                                            toggleJoin(c.id);
                                        }}
                                        className={`cursor-pointer mt-1 w-full text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                                            c.joined
                                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    >
                                        {c.joined ? "Joined" : "Join"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                            <Icon.Users className="text-blue-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                            {activeTab === "mine" ? "You haven't joined any communities yet" : "No communities found"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {activeTab === "mine" ? "Discover a community to start connecting." : "Try a different search or category."}
                        </p>
                        {activeTab === "mine" && (
                            <button
                                onClick={() => setActiveTab("discover")}
                                className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                            >
                                Discover communities
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ------------------------------------------------------ */}
            {/* Create community modal — vẫn giữ dạng modal vì đây là hành */}
            {/* động ngắn (tạo mới), không phải điều hướng xem chi tiết. */}
            {/* ------------------------------------------------------ */}
            {isCreateOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsCreateOpen(false); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-base font-bold text-gray-900">Create community</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                <Icon.X />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">Start a space for people who share your craft.</p>

                        <form onSubmit={submitCommunity} className="space-y-4">
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
                                                selectedCat
                                                    ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent`
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span style={selectedCat ? {} : { filter: "grayscale(1) opacity(0.6)" }}>{cfg.icon}</span>
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Community name</label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Saigon Street Photographers"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="What is this community about?"
                                    rows={3}
                                    maxLength={200}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y"
                                />
                                <p className="text-xs text-gray-400 mt-1.5 text-right">{createForm.description.length}/200</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Privacy</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCreateForm((f) => ({ ...f, isPrivate: false }))}
                                        className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                            !createForm.isPrivate ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon.Globe /> Public
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCreateForm((f) => ({ ...f, isPrivate: true }))}
                                        className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                            createForm.isPrivate ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon.Lock /> Private
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5">
                                    {createForm.isPrivate ? "People need to be invited or approved to join." : "Anyone can find and join this community."}
                                </p>
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
                                    disabled={!createForm.name.trim() || !createForm.category}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create community
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
