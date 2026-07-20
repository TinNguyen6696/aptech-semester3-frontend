import { useRef, useState } from "react";
import { IconContestDetail, RANK_STYLE } from "./contestCategoryConfig";
import { API } from "@/lib/apiendpoint";
import { StringValue } from "@/lib/stringValue";

export default function ContestVideoCard({ entry, rank, onVote, onOpen, onDelete, role }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    console.log("check entry: ", entry)
    const isVoted = entry.isVoted;
    const playVideo = () => {
        const el = videoRef.current;
        if (!el) return;
        el.currentTime = 0;
        el.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    const pauseVideo = () => {
        const el = videoRef.current;
        if (!el) return;
        el.pause();
        el.currentTime = 0;
        setIsPlaying(false);
    };

    const rankStyle = rank && rank <= 3 ? RANK_STYLE[rank] : null;

    return (
        <div className="group">
            <div
                className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-200 cursor-pointer ring-2 ring-offset-2 ${
                    rankStyle ? rankStyle.ring : "ring-transparent"
                }`}
                onMouseEnter={playVideo}
                onMouseLeave={pauseVideo}
            >
                <video
                    ref={videoRef}
                    src={`${API.URL}${entry.videoUrl}`}
                    poster={entry.thumbnail}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="auto"
                />

                {/* Rank badge */}
                {rankStyle ? (
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1 ${rankStyle.chip} text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm`}>
                        {rank === 1 ? <IconContestDetail.Crown /> : null}
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

                {entry.mine && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(entry.id);
                        }}
                        className="cursor-pointer absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-red-500/80 hover:bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm"
                        aria-label="Delete entry"
                    >
                        <IconContestDetail.Trash className="w-3.5 h-3.5" />
                        Delete
                    </button>
                )}

                <button
                    onClick={() => onOpen?.(entry)}
                    className="cursor-pointer absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/50 hover:bg-black/70 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm"
                    aria-label="Watch video"
                >
                    <IconContestDetail.Expand className="w-3.5 h-3.5" />
                    Watch
                </button>

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none group-hover:opacity-0 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0 cursor-pointer" onClick={() => onOpen?.(entry)}>
                    <h3 className="text-[15px] font-semibold text-gray-900 truncate">{entry.videoTitle}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{entry.owner.username}</p>
                </div>

                {role !== StringValue.RECRUITER && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote?.(entry.id);
                        }}
                        disabled={entry.mine}
                        className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-lg border font-bold transition-all
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${
                                isVoted
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                            }
                        `}
                    >
                        <IconContestDetail.ChevronUp />

                        <span className="text-xs font-bold">
                            {entry.voteCount}
                        </span>

                        <span className="text-[9px]">
                            {isVoted ? "Voted" : "Vote"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}