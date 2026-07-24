import { API } from "@/lib/apiendpoint";
import DateUtil from "@/lib/dateUtil";


export default function VideoRowCard({ video, openMenuId, setOpenMenuId, onDeleteClick, onEditClick }) {
  const isMenuOpen = openMenuId === video.id;
  const videoSrc = `${API.URL}${video.videoUrl}`;

  return (
    <div className="group">
      <div className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br ${video.gradient}`}>
        {videoSrc ? (
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No preview
          </div>
        )}


        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-black/30 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
            {video.category}
          </span>
          {video.isRemovedByAdmin && (
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full">
              Banned
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : video.id);
            }}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                  onEditClick(video);
                }}
                className="w-full text-left px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Edit details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                  onDeleteClick(video);
                }}
                className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
      </div>
      {video.isRemovedByAdmin && (
        <p className="text-xs text-red-500 mt-1">This video violated our guidelines and was banned. You can delete it via the menu above.</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {video.visibility}
        </span>
        <span className="text-xs text-gray-400">{DateUtil.timeAgo(video.createdAt+'Z')}</span>
      </div>
    </div>
  );
}