import { useRef, useState } from "react";
import { IconContestDetail } from "./contestCategoryConfig";


export default function VideoExpandModal({ video, onClose }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!video) return null;

    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, "0")}`;
    };

    const resetHideTimer = () => {
        setShowControls(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) setShowControls(false);
        }, 2500);
    };

    const togglePlay = () => {
        const el = videoRef.current;
        if (!el) return;
        if (el.paused) { el.play(); } else { el.pause(); }
    };

    const handleTimeUpdate = () => {
        const el = videoRef.current;
        if (!el || !el.duration) return;
        setCurrentTime(el.currentTime);
        setDuration(el.duration);
        setProgress((el.currentTime / el.duration) * 100);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = videoRef.current;
        if (!el) return;
        const rect = e.currentTarget.getBoundingClientRect();
        el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration;
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (videoRef.current) {
            videoRef.current.volume = v;
            videoRef.current.muted = v === 0;
        }
        setMuted(v === 0);
    };

    const toggleMute = () => {
        const el = videoRef.current;
        if (!el) return;
        const next = !muted;
        el.muted = next;
        setMuted(next);
        if (!next && volume === 0) { setVolume(1); el.volume = 1; }
    };

    const handleSpeed = (s: number) => {
        setSpeed(s);
        if (videoRef.current) videoRef.current.playbackRate = s;
        setShowSpeedMenu(false);
    };

    const handleFullscreen = () => {
        wrapRef.current?.requestFullscreen?.();
    };

    const SPEEDS = [0.5, 1, 1.5, 2];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-4xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center shadow-md"
                    aria-label="Close"
                >
                    <IconContestDetail.Close className="w-4 h-4" />
                </button>

                {/* Video container */}
                <div
                    ref={wrapRef}
                    className="relative bg-black rounded-xl overflow-hidden aspect-video group"
                    onMouseMove={resetHideTimer}
                    onMouseEnter={resetHideTimer}
                    onClick={togglePlay}
                >
                    <video
                        ref={videoRef}
                        src={`${API.URL}${video.videoUrl}`}
                        poster={video.thumbnail ?? undefined}
                        className="w-full h-full object-contain"
                        playsInline
                        autoPlay
                        onPlay={() => setPlaying(true)}
                        onPause={() => { setPlaying(false); setShowControls(true); }}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                    />

                    {/* Controls overlay */}
                    <div
                        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 flex flex-col gap-2 transition-opacity duration-200 ${
                            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Timeline */}
                        <div
                            className="relative h-4 flex items-center cursor-pointer group/tl"
                            onClick={handleSeek}
                        >
                            <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden group-hover/tl:h-1.5 transition-all">
                                <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none"
                                style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
                            />
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center gap-3">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="cursor-pointer text-white hover:text-white/80 transition-colors"
                                aria-label={playing ? "Pause" : "Play"}
                            >
                                {playing ? <IconContestDetail.Pause className="w-5 h-5" /> : <IconContestDetail.Play className="w-5 h-5" />}
                            </button>

                            {/* Time */}
                            <span className="text-xs text-white/70 tabular-nums">
                                {fmt(currentTime)} / {fmt(duration)}
                            </span>

                            <div className="flex-1" />

                            {/* Volume */}
                            <div className="flex items-center gap-1.5">
                                <button onClick={toggleMute} className="cursor-pointer text-white hover:text-white/80" aria-label="Toggle mute">
                                    {muted || volume === 0
                                        ? <IconContestDetail.VolumeOff className="w-5 h-5" />
                                        : <IconContestDetail.VolumeOn className="w-5 h-5" />
                                    }
                                </button>
                                <input
                                    type="range" min={0} max={1} step={0.05}
                                    value={muted ? 0 : volume}
                                    onChange={handleVolume}
                                    className="w-20 accent-white cursor-pointer"
                                    aria-label="Volume"
                                />
                            </div>

                            {/* Speed */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowSpeedMenu((p) => !p)}
                                    className="cursor-pointer text-xs font-semibold text-white bg-white/15 hover:bg-white/25 px-2 py-1 rounded-md"
                                >
                                    {speed}×
                                </button>
                                {showSpeedMenu && (
                                    <div className="absolute bottom-8 right-0 bg-gray-900 border border-white/10 rounded-xl overflow-hidden text-sm shadow-xl min-w-[80px]">
                                        {SPEEDS.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleSpeed(s)}
                                                className={`cursor-pointer w-full px-4 py-2 text-center hover:bg-white/10 transition-colors ${
                                                    s === speed ? "text-blue-400 font-semibold" : "text-white/80"
                                                }`}
                                            >
                                                {s}×
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fullscreen */}
                            <button onClick={handleFullscreen} className="cursor-pointer text-white hover:text-white/80" aria-label="Fullscreen">
                                <IconContestDetail.Expand className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Meta below video */}
                <div className="mt-3 px-1">
                    <p className="text-white font-semibold text-[15px]">{video.videoTitle}</p>
                    <p className="text-white/50 text-sm mt-0.5">{video.mine ? "You" : video.author}</p>
                </div>
            </div>
        </div>
    );
}