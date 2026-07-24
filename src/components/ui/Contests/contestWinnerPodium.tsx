import { useNavigate } from "@tanstack/react-router";
import { API } from "@/lib/apiendpoint";
import { IconContestDetail } from "./contestCategoryConfig";


export default function WinnerPodium({ top3, onOpen }) {
    const navigate = useNavigate();
    const goToOwnerProfile = (e, ownerId) => {
        e.stopPropagation();
        if (ownerId) navigate({ to: "/mentorProfile", search: { id: ownerId } });
    };

    const PODIUM_CONFIG = {
        1: { label: "1st place", chipBg: "bg-amber-100", chipText: "text-amber-700", border: "border-amber-300", crown: true },
        2: { label: "2nd place", chipBg: "bg-gray-100", chipText: "text-gray-600", border: "border-gray-300", crown: false },
        3: { label: "3rd place", chipBg: "bg-orange-100", chipText: "text-orange-600", border: "border-orange-300", crown: false },
    };

    const [first, ...rest] = top3;

    return (
        <div className="mb-10">
            {/* Banner */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
                    <IconContestDetail.Crown /> Contest ended · Final results
                </span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex flex-col gap-4">
                {first && (() => {
                    const cfg = PODIUM_CONFIG[1];
                    return (
                        <div
                            onClick={() => onOpen?.(first)}
                            className={`cursor-pointer max-w-lg mx-auto w-full h-64 bg-white rounded-2xl border ${cfg.border} overflow-hidden flex items-stretch transition-opacity hover:opacity-90`}
                        >
                            <div className="relative w-44 flex-shrink-0 bg-gray-900">
                                <video
                                    src={first.videoUrl?.startsWith("http") ? first.videoUrl : `${API.URL}${first.videoUrl}`}
                                    className="w-full h-full object-cover"
                                    muted playsInline preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 px-4 py-4 flex flex-col justify-center gap-1.5">
                                <span className={`self-start inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.chipBg} ${cfg.chipText}`}>
                                    <IconContestDetail.Crown />
                                    {cfg.label}
                                </span>
                                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">{first.videoTitle}</h3>
                                <p
                                    className={`text-sm text-gray-500 w-fit ${!first.mine && first.owner?.id ? "hover:text-blue-600 hover:underline" : ""}`}
                                    onClick={(e) => !first.mine && goToOwnerProfile(e, first.owner?.id)}
                                >
                                    {first.mine ? "You" : first.owner?.username ?? first.author}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <IconContestDetail.ChevronUp className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-700">{first.voteCount}</span>
                                    <span className="text-xs text-gray-400">votes</span>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {rest.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {rest.map((entry, i) => {
                            const rank = i + 2;
                            const cfg = PODIUM_CONFIG[rank];
                            return (
                                <div
                                    key={entry.id}
                                    onClick={() => onOpen?.(entry)}
                                    className={`cursor-pointer h-64 bg-white rounded-2xl border ${cfg.border} overflow-hidden flex items-stretch transition-opacity hover:opacity-90`}
                                >
                                    <div className="relative w-28 flex-shrink-0 bg-gray-900">
                                        <video
                                            src={entry.videoUrl?.startsWith("http") ? entry.videoUrl : `${API.URL}${entry.videoUrl}`}
                                            className="w-full h-full object-cover"
                                            muted playsInline preload="metadata"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-1">
                                        <span className={`self-start inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.chipBg} ${cfg.chipText}`}>
                                            {cfg.label}
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{entry.videoTitle}</p>
                                        <p
                                            className={`text-xs text-gray-500 truncate w-fit ${!entry.mine && entry.owner?.id ? "hover:text-blue-600 hover:underline" : ""}`}
                                            onClick={(e) => !entry.mine && goToOwnerProfile(e, entry.owner?.id)}
                                        >
                                            {entry.mine ? "You" : entry.owner?.username ?? entry.author}
                                        </p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <IconContestDetail.ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-700">{entry.voteCount}</span>
                                            <span className="text-[11px] text-gray-400">votes</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}