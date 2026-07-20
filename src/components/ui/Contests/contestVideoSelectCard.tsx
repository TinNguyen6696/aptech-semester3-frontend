import { useRef, useState } from "react";
import { IconContestDetail } from "./contestCategoryConfig";


export default function VideoSelectCard({ video, isSelected, onSelect, onExpand }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const togglePlay = (e) => {
        e.stopPropagation();
        const el = videoRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
            setPlaying(false);
        } else {
            el.play().catch(() => {});
            setPlaying(true);
        }
    };

    return (
        <div className={`rounded-2xl border-2 transition-all overflow-hidden ${
            isSelected ? "border-blue-600 bg-blue-50/30" : "border-gray-100 bg-white hover:border-gray-200"
        }`}>
            <div className="relative aspect-video bg-gray-900">
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    poster={video.thumbnail ?? undefined}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onEnded={() => setPlaying(false)}
                />
                <button
                    type="button"
                    onClick={togglePlay}
                    className="cursor-pointer absolute inset-0 flex items-center justify-center group/play"
                    aria-label={playing ? "Pause" : "Play"}
                >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        playing
                            ? "bg-black/0 group-hover/play:bg-black/40 opacity-0 group-hover/play:opacity-100"
                            : "bg-black/40 group-hover/play:bg-black/60"
                    }`}>
                        {playing
                            ? <IconContestDetail.Pause className="text-white w-5 h-5" />
                            : <IconContestDetail.Play className="text-white w-5 h-5 ml-0.5" />
                        }
                    </div>
                </button>

                {/* Expand / fullscreen button */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onExpand?.(video); }}
                    className="cursor-pointer absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
                    aria-label="Expand video"
                >
                    <IconContestDetail.Expand className="text-white w-3.5 h-3.5" />
                </button>
            </div>

            {/* Bottom bar: title + radio */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{video.videoTitle}</p>
                    {video.category && (
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                            {video.category}
                        </span>
                    )}
                </div>

                {/* Radio-style select */}
                <button
                    type="button"
                    onClick={() => onSelect(isSelected ? null : video.id)}
                    className="cursor-pointer flex-shrink-0 flex items-center gap-2 text-sm font-medium transition-colors"
                    aria-pressed={isSelected}
                >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                    }`}>
                        {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-white block" />
                        )}
                    </span>
                    <span className={isSelected ? "text-blue-600" : "text-gray-400"}>
                        {isSelected ? "Selected" : "Select"}
                    </span>
                </button>
            </div>
        </div>
    );
}