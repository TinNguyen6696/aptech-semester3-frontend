import { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Shared category config — same palette/keys as Communities.jsx so both pages
// stay visually consistent.
// ---------------------------------------------------------------------------
const CATEGORY_CONFIG = {
    musicians: {
        label: "Musicians",
        badgeBg: "bg-amber-100",
        badgeColor: "text-amber-700",
        iconBg: "bg-amber-100",
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

// ---------------------------------------------------------------------------
// Icon set — mirrors Communities.jsx, extended with a few detail-page icons.
// ---------------------------------------------------------------------------
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
    X: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    ),
    Heart: (props) => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    ),
    ArrowLeft: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    ),
    Share: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5" />
        </svg>
    ),
    Crown: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
            <path d="M3 19h18l-1.5-9-4.5 3-3-6-3 6-4.5-3L3 19Z" />
        </svg>
    ),
    Shield: (props) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
            <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
        </svg>
    ),
    More: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    ),
    Send: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
        </svg>
    ),
};

// ---------------------------------------------------------------------------
// Mock data — shaped after the DB schema (communities, community_posts,
// community_members / users+user_profiles, comments, likes).
// ---------------------------------------------------------------------------
// TODO: thay bằng dữ liệu thật (React Query / API) — tra theo `id` nhận từ route.
// Tạm thời để danh sách mock, tìm theo id giống cách bạn đang làm ở contestDetail.
const ALL_COMMUNITIES = [
    {
        id: "c1",
        name: "Rhythm Collective",
        category: "musicians",
        isPrivate: false,
        description:
            "For instrumentalists, singers and producers who want honest feedback and jam-session buddies. Share your covers, find bandmates and swap gear tips.",
        memberCount: 342,
        joined: true,
        postsThisWeek: 18,
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
    },
];

const ADMINS = [
    { id: "u1", name: "Mai Lâm", role: "admin", initial: "M" },
    { id: "u2", name: "Quang Huy", role: "mentor", initial: "Q" },
];

const RULES = [
    "Tôn trọng mọi thành viên — không công kích cá nhân.",
    "Chỉ đăng nội dung liên quan đến âm nhạc và sáng tác.",
    "Ghi rõ nguồn khi chia sẻ bản cover hoặc bản phối của người khác.",
];

const MEMBERS = [
    { id: "u1", name: "Mai Lâm", role: "admin", skillLevel: "advanced" },
    { id: "u2", name: "Quang Huy", role: "mentor", skillLevel: "advanced" },
    { id: "u3", name: "Thảo Vy", role: "member", skillLevel: "intermediate" },
    { id: "u4", name: "Đình Phúc", role: "member", skillLevel: "beginner" },
    { id: "u5", name: "Bảo Trân", role: "member", skillLevel: "intermediate" },
    { id: "u6", name: "Anh Tuấn", role: "recruiter", skillLevel: "advanced" },
    { id: "u7", name: "Kim Chi", role: "member", skillLevel: "beginner" },
    { id: "u8", name: "Việt Hoàng", role: "member", skillLevel: "intermediate" },
    { id: "u9", name: "Ngọc Hân", role: "member", skillLevel: "advanced" },
];

const INITIAL_POSTS = [
    {
        id: "p1",
        author: "Mai Lâm",
        role: "admin",
        time: "2 giờ trước",
        pinned: true,
        text: "Dropped a new acoustic cover — would love a critique on the bridge section before I record the final take.",
        likes: 12,
        liked: false,
        comments: [
            { id: "cm1", author: "Quang Huy", text: "Bridge nghe hơi vội, thử kéo dài thêm 2 nhịp xem sao." },
            { id: "cm2", author: "Thảo Vy", text: "Giọng hát đoạn đó rất cảm xúc luôn!" },
        ],
    },
    {
        id: "p2",
        author: "Quang Huy",
        role: "mentor",
        time: "1 ngày trước",
        pinned: false,
        text: "Anyone free to jam this Saturday? Looking for a bassist and a drummer near District 1.",
        likes: 7,
        liked: true,
        comments: [{ id: "cm3", author: "Đình Phúc", text: "Mình chơi bass, để lại số mình nhắn nhé." }],
    },
    {
        id: "p3",
        author: "Bảo Trân",
        role: "member",
        time: "2 ngày trước",
        pinned: false,
        text: "Vừa hoàn thành khóa học mixing cơ bản, ai cần review track cứ thả link ở đây mình nghe giúp.",
        likes: 15,
        liked: false,
        comments: [],
    },
];

const ROLE_BADGE = {
    admin: { label: "Admin", icon: Icon.Crown, cls: "bg-amber-50 text-amber-700" },
    mentor: { label: "Mentor", icon: Icon.Shield, cls: "bg-blue-50 text-blue-700" },
    recruiter: { label: "Recruiter", icon: Icon.Shield, cls: "bg-emerald-50 text-emerald-700" },
    member: null,
};

const timeAgo = () => "Vừa xong";

export default function CommunityDetail({ id }) {
    // Tra cộng đồng theo id nhận từ route (search param `?id=...`).
    const COMMUNITY = useMemo(
        () => ALL_COMMUNITIES.find((c) => c.id === id) ?? ALL_COMMUNITIES[0],
        [id]
    );

    const cfg = CATEGORY_CONFIG[COMMUNITY.category];

    const [joined, setJoined] = useState(COMMUNITY.joined);
    const [memberCount, setMemberCount] = useState(COMMUNITY.memberCount);
    const [activeTab, setActiveTab] = useState("discussion"); // discussion | members

    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [newPostText, setNewPostText] = useState("");
    const [openComments, setOpenComments] = useState({});
    const [commentDrafts, setCommentDrafts] = useState({});

    const [memberQuery, setMemberQuery] = useState("");

    const pinnedPosts = useMemo(() => posts.filter((p) => p.pinned), [posts]);
    const feedPosts = useMemo(() => posts.filter((p) => !p.pinned), [posts]);

    const filteredMembers = useMemo(
        () => MEMBERS.filter((m) => m.name.toLowerCase().includes(memberQuery.trim().toLowerCase())),
        [memberQuery]
    );

    const toggleJoin = () => {
        setJoined((j) => !j);
        setMemberCount((c) => c + (joined ? -1 : 1));
    };

    const submitPost = () => {
        if (!newPostText.trim()) return;
        setPosts((prev) => [
            {
                id: `p${Date.now()}`,
                author: "You",
                role: "member",
                time: timeAgo(),
                pinned: false,
                text: newPostText.trim(),
                likes: 0,
                liked: false,
                comments: [],
            },
            ...prev,
        ]);
        setNewPostText("");
    };

    const toggleLike = (postId) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))
        );
    };

    const toggleComments = (postId) => setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

    const submitComment = (postId) => {
        const text = (commentDrafts[postId] || "").trim();
        if (!text) return;
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? { ...p, comments: [...p.comments, { id: `cm${Date.now()}`, author: "You", text }] }
                    : p
            )
        );
        setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    };

    const PostCard = ({ post }) => (
        <div className="border border-gray-100 rounded-xl p-4">
            {post.pinned && (
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-3">
                    📌 Ghim
                </div>
            )}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                            {ROLE_BADGE[post.role] && (
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[post.role].cls}`}>
                                    {ROLE_BADGE[post.role].icon({})} {ROLE_BADGE[post.role].label}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-400">{post.time}</span>
                    </div>
                </div>
                <button className="cursor-pointer text-gray-300 hover:text-gray-500 transition-colors">
                    <Icon.More />
                </button>
            </div>

            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{post.text}</p>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400 font-medium">
                <button
                    onClick={() => toggleLike(post.id)}
                    className={`cursor-pointer inline-flex items-center gap-1 transition-colors ${post.liked ? "text-rose-600" : "hover:text-gray-600"}`}
                >
                    <Icon.Heart fill={post.liked ? "currentColor" : "none"} /> {post.likes}
                </button>
                <button
                    onClick={() => toggleComments(post.id)}
                    className="cursor-pointer inline-flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                    <Icon.MessageSquare /> {post.comments.length}
                </button>
            </div>

            {openComments[post.id] && (
                <div className="mt-3 pt-3 border-t border-gray-50 space-y-2.5">
                    {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2">
                            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                {c.author.charAt(0)}
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-1.5 flex-1">
                                <p className="text-xs font-semibold text-gray-700">{c.author}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={commentDrafts[post.id] || ""}
                            onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                            placeholder="Viết bình luận..."
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                        <button
                            onClick={() => submitComment(post.id)}
                            className="cursor-pointer text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                            aria-label="Gửi bình luận"
                        >
                            <Icon.Send />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-5xl mx-auto">
                {/* Back link */}
                <button className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-5">
                    <Icon.ArrowLeft /> Communities
                </button>

                {/* Compact header row — no banner */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                    <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                            {cfg.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-gray-900">{COMMUNITY.name}</h1>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                    {cfg.label}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                    {COMMUNITY.isPrivate ? <Icon.Lock /> : <Icon.Globe />}
                                    {COMMUNITY.isPrivate ? "Private" : "Public"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium">
                                <span className="inline-flex items-center gap-1">
                                    <Icon.Users /> {memberCount.toLocaleString()} members
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Icon.MessageSquare /> {COMMUNITY.postsThisWeek} posts this week
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            aria-label="Share community"
                        >
                            <Icon.Share /> Share
                        </button>
                        <button
                            onClick={toggleJoin}
                            className={`cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                                joined ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {joined ? "Joined" : "Join community"}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-5">{COMMUNITY.description}</p>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-gray-100 mb-6">
                    {[
                        { id: "discussion", label: "Discussion", icon: Icon.MessageSquare },
                        { id: "members", label: "Members", icon: Icon.Users },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <tab.icon /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body: content + sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    <div className="min-w-0">
                        {activeTab === "discussion" && (
                            <div className="space-y-4">
                                {joined && (
                                    <div className="border border-gray-100 rounded-xl p-3">
                                        <textarea
                                            value={newPostText}
                                            onChange={(e) => setNewPostText(e.target.value)}
                                            placeholder="Share an update, ask for advice, or start a discussion..."
                                            rows={2}
                                            className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={submitPost}
                                                disabled={!newPostText.trim()}
                                                className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {pinnedPosts.map((post) => <PostCard key={post.id} post={post} />)}
                                {feedPosts.length > 0 ? (
                                    feedPosts.map((post) => <PostCard key={post.id} post={post} />)
                                ) : pinnedPosts.length === 0 ? (
                                    <div className="text-center p-10 text-gray-500 border border-dashed rounded-xl text-sm">
                                        No discussions yet. Be the first to post.
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {activeTab === "members" && (
                            <div>
                                <div className="relative max-w-xs mb-4">
                                    <input
                                        type="text"
                                        value={memberQuery}
                                        onChange={(e) => setMemberQuery(e.target.value)}
                                        placeholder="Search members"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {filteredMembers.map((m) => (
                                        <div key={m.id} className="border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                                                    {ROLE_BADGE[m.role] && (
                                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${ROLE_BADGE[m.role].cls}`}>
                                                            {ROLE_BADGE[m.role].icon({})}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 capitalize">{m.skillLevel}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <p className="text-sm text-gray-400 col-span-full text-center py-8">No members match "{memberQuery}"</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Admins &amp; mentors</h3>
                            <div className="space-y-3">
                                {ADMINS.map((a) => (
                                    <div key={a.id} className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {a.initial}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${ROLE_BADGE[a.role].cls.split(" ")[1]}`}>
                                                {ROLE_BADGE[a.role].icon({})} {ROLE_BADGE[a.role].label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-gray-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Community rules</h3>
                            <ul className="space-y-1.5">
                                {RULES.map((rule, i) => (
                                    <li key={i} className="text-xs text-gray-500 leading-relaxed">• {rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
