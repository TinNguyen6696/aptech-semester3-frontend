
import { useNavigate } from "@tanstack/react-router";
import { API } from "@/lib/apiendpoint";

export default function RelatedVideoCard({ video }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                navigate({ to: "/videoDetail", search: { id: video.id } });
            }}
            className="flex gap-2.5 cursor-pointer group"
        >
            <div className="relative w-32 shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-gray-200">
                <video
                    src={`${API.URL}${video.videoUrl}`}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                />
                <span className="absolute top-1.5 left-1.5 bg-black/30 text-white text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {video.category?.toUpperCase()}
                </span>
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{video.owner?.username}</p>
                <p className="text-xs text-gray-400">{video.viewCount ?? 0} views</p>
            </div>
        </div>
    );
}