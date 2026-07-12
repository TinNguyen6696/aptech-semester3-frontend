// src/components/VideoCard.jsx
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { API } from "@/lib/apiendpoint";

export default function PublicVideoCard({ video }) {
    const videoRef = useRef(null);
    const navigate = useNavigate();

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

    const handleClick = () => {
        navigate({ to: "/videoDetail", search: { id: video.id } });
    };

    return (
        <div className="group cursor-pointer" onClick={handleClick}>
            <div
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-200"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <video
                    ref={videoRef}
                    src={`${API.URL}${video.videoUrl}`}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
                <span className="absolute top-3 left-3 bg-black/30 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {video.category?.toUpperCase()}
                </span>
            </div>
            <h3 className="mt-3 text-[15px] font-semibold text-gray-900">{video.title}</h3>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">{video.owner?.username}</span>
            </div>
        </div>
    );
}