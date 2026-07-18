import { API } from "@/lib/apiendpoint";
import { RANK_STYLE, IconContestDetail } from "./contestCategoryConfig";


export default function LeaderboardRow({ entry, rank, maxVotes, onOpen }) {
    const rankStyle = RANK_STYLE[rank];
    const pct = maxVotes > 0 ? Math.max(6, Math.round((entry.voteCount  / maxVotes) * 100)) : 0;

    return (
        <div onClick={() => onOpen?.(entry)} className="cursor-pointer flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${rankStyle.chip}`}>
                {rank === 1 ? <IconContestDetail.Crown /> : rank}
            </div>

            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-900 relative">
                <video
                    src={
                        entry.videoUrl?.startsWith("http")
                            ? entry.videoUrl
                            : `${API.URL}${entry.videoUrl}`
                    }
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg className="w-3 h-3 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
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
                <p className="text-sm font-extrabold text-gray-900">{entry.voteCount}</p>
                <p className="text-[10px] text-gray-400">votes</p>
            </div>
        </div>
    );
}