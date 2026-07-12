import { useMemo, useRef, useState } from "react";

const Icon = {
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
};

const CATEGORY_CONFIG = {
    singer: { label: "Singer", badgeBg: "bg-amber-100", badgeColor: "text-amber-700" },
    dancer: { label: "Dancer", badgeBg: "bg-purple-100", badgeColor: "text-purple-700" },
    artist: { label: "Artist", badgeBg: "bg-rose-100", badgeColor: "text-rose-700" },
    designer: { label: "Designer", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    coder: { label: "Coder", badgeBg: "bg-indigo-100", badgeColor: "text-indigo-700" },
    photographer: { label: "Photographer", badgeBg: "bg-blue-100", badgeColor: "text-blue-700" },
};

const STATUS_CONFIG = {
    upcoming: { label: "Upcoming", badgeBg: "bg-gray-100", badgeColor: "text-gray-600" },
    active: { label: "Voting open", badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700" },
    ended: { label: "Ended", badgeBg: "bg-gray-100", badgeColor: "text-gray-400" },
};

const RANK_STYLE = {
    1: { ring: "ring-amber-400", chip: "bg-amber-500 text-white", label: "#1" },
    2: { ring: "ring-gray-300", chip: "bg-gray-400 text-white", label: "#2" },
    3: { ring: "ring-orange-300", chip: "bg-orange-400 text-white", label: "#3" },
};

function ContestVideoCard({ entry, rank, onVote, onOpen }) {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        const el = videoRef.current;
        if (el) {
            el.currentTime = 0;
            el.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        const el = videoRef.current;
        if (el) {
            el.pause();
            el.currentTime = 0;
        }
    };

    const rankStyle = rank && rank <= 3 ? RANK_STYLE[rank] : null;

    return (
        <div className="group">
            <div
                onClick={() => onOpen?.(entry)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-200 cursor-pointer ring-2 ring-offset-2 ${
                    rankStyle ? rankStyle.ring : "ring-transparent"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <video
                    ref={videoRef}
                    src={entry.videoUrl}
                    poster={entry.thumbnail}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />

                {/* top-left: rank or category */}
                {rankStyle ? (
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1 ${rankStyle.chip} text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm`}>
                        {rank === 1 ? <Icon.Crown /> : null}
                        {rankStyle.label}
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 bg-black/30 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
                        #{rank}
                    </span>
                )}

                {entry.mine && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        Your entry
                    </span>
                )}

                {/* play glyph on hover, subtle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-0 pointer-events-none" />
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0 cursor-pointer" onClick={() => onOpen?.(entry)}>
                    <h3 className="text-[15px] font-semibold text-gray-900 truncate">{entry.videoTitle}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{entry.mine ? "You" : entry.author}</p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVote?.(entry.id);
                    }}
                    disabled={entry.mine}
                    className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-lg border font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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
        </div>
    );
}

/* =========================================================================
   Sidebar leaderboard item (compact)
   ========================================================================= */
function LeaderboardRow({ entry, rank, maxVotes, onOpen }) {
    const rankStyle = RANK_STYLE[rank];
    const pct = maxVotes > 0 ? Math.max(6, Math.round((entry.votes / maxVotes) * 100)) : 0;

    return (
        <div onClick={() => onOpen?.(entry)} className="cursor-pointer flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${rankStyle.chip}`}>
                {rank === 1 ? <Icon.Crown /> : rank}
            </div>

            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                {entry.thumbnail ? (
                    <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Icon.Play />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{entry.videoTitle}</p>
                <p className="text-xs text-gray-400 truncate">{entry.mine ? "You" : entry.author}</p>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${rank === 1 ? "bg-amber-500" : rank === 2 ? "bg-gray-400" : "bg-orange-400"}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            <div className="flex-shrink-0 text-right">
                <p className="text-sm font-extrabold text-gray-900">{entry.votes}</p>
                <p className="text-[10px] text-gray-400">votes</p>
            </div>
        </div>
    );
}

/* =========================================================================
   ContestDetail
   ========================================================================= */
export default function ContestDetail({ contest: contestProp, onVote: onVoteProp, onBack, onOpenEntry }) {
    const [internalContest, setInternalContest] = useState(contestProp ?? DEMO_CONTEST);

    const contest = contestProp ?? internalContest;

    const handleVote = (entryId) => {
        if (onVoteProp) {
            onVoteProp(contest.id, entryId);
            return;
        }
        setInternalContest((prev) => ({
            ...prev,
            entries: prev.entries.map((e) =>
                e.id === entryId ? { ...e, votedByMe: !e.votedByMe, votes: e.votes + (e.votedByMe ? -1 : 1) } : e
            ),
        }));
    };

    const sortedEntries = useMemo(() => [...contest.entries].sort((a, b) => b.votes - a.votes), [contest.entries]);
    const top3 = sortedEntries.slice(0, 3);
    const maxVotes = sortedEntries[0]?.votes ?? 0;
    const cfg = CATEGORY_CONFIG[contest.category];
    const status = STATUS_CONFIG[contest.status ?? "active"];

    const formatDate = (isoDate) =>
        new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10 bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Back */}
                <button
                    onClick={onBack}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-6"
                >
                    <Icon.ArrowLeft /> Back to contests
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                {cfg.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badgeBg} ${status.badgeColor}`}>
                                {status.label}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{contest.title}</h1>
                        <p className="text-sm text-gray-500 mt-1.5 max-w-2xl leading-relaxed">{contest.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                            <span className="inline-flex items-center gap-1">
                                <Icon.Calendar /> {formatDate(contest.startDate)} – {formatDate(contest.endDate)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Icon.Users /> {contest.entries.length} entries
                            </span>
                            <span>Hosted by {contest.createdBy}</span>
                        </div>
                    </div>
                </div>

                {/* Body: grid + sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                    {/* Video grid, 2 columns */}
                    <div>
                        {sortedEntries.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                {sortedEntries.map((entry, i) => (
                                    <ContestVideoCard
                                        key={entry.id}
                                        entry={entry}
                                        rank={i + 1}
                                        onVote={handleVote}
                                        onOpen={onOpenEntry}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center bg-white">
                                <p className="text-sm font-semibold text-gray-700">No entries yet</p>
                                <p className="text-xs text-gray-400 mt-1">Be the first to submit a video.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: top 3 leaderboard */}
                    <aside className="lg:sticky lg:top-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Icon.Flame className="text-orange-500" />
                                <h2 className="text-sm font-bold text-gray-900">Leading now</h2>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">Top 3 by votes</p>

                            {top3.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {top3.map((entry, i) => (
                                        <LeaderboardRow
                                            key={entry.id}
                                            entry={entry}
                                            rank={i + 1}
                                            maxVotes={maxVotes}
                                            onOpen={onOpenEntry}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 py-4 text-center">No votes yet</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   Demo data — replace videoUrl / thumbnail with your real API-backed values
   (e.g. `${API.URL}${entry.videoUrl}`), and wire onVote / onOpenEntry / onBack
   to your app's mutation + router as needed.
   ========================================================================= */
const SAMPLE_VIDEOS = [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/christmas.mp4",
];

const DEMO_CONTEST = {
    id: "ct1",
    title: "60-Second Solo Vocal Challenge",
    category: "singer",
    status: "active",
    description: "Submit a 60-second solo vocal performance, any genre. Community votes decide the top three.",
    startDate: "2026-07-01",
    endDate: "2026-07-20",
    createdBy: "Rhythm Collective",
    entries: [
        { id: "en1", videoTitle: "Rainy Nights (acoustic)", author: "Mai Lâm", votes: 128, votedByMe: true, mine: false, videoUrl: SAMPLE_VIDEOS[0] },
        { id: "en2", videoTitle: "City Lights", author: "Thảo Vy", votes: 96, votedByMe: false, mine: false, videoUrl: SAMPLE_VIDEOS[1] },
        { id: "en3", videoTitle: "Homebound", author: "Quang Huy", votes: 74, votedByMe: false, mine: false, videoUrl: SAMPLE_VIDEOS[2] },
        { id: "en4", videoTitle: "Golden Hour", author: "You", votes: 41, votedByMe: false, mine: true, videoUrl: SAMPLE_VIDEOS[0] },
        { id: "en5", videoTitle: "Rush Hour", author: "Trần Bảo", votes: 63, votedByMe: true, mine: false, videoUrl: SAMPLE_VIDEOS[1] },
        { id: "en6", videoTitle: "Fragments", author: "Đức Minh", votes: 22, votedByMe: false, mine: false, videoUrl: SAMPLE_VIDEOS[2] },
    ],
};
