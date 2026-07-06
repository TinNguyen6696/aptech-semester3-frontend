import { useState } from 'react';
import UploadVideoModal from '@/components/Model/UploadVideo/uploadVideoModal';

const MY_VIDEOS = [
  {
    id: 1,
    title: 'Fingerstyle cover — first attempt',
    category: 'MUSIC',
    gradient: 'from-purple-500 to-violet-700',
    duration: '2:18',
    views: '94K',
    likes: '8.1K',
    status: 'published',
    uploadedAt: '3 days ago',
  },
  {
    id: 2,
    title: 'Rooftop freestyle at golden hour',
    category: 'DANCE',
    gradient: 'from-orange-400 to-red-500',
    duration: '1:05',
    views: '210K',
    likes: '19K',
    status: 'published',
    uploadedAt: '1 week ago',
  },
  {
    id: 3,
    title: 'New sketch — timelapse (processing)',
    category: 'ART',
    gradient: 'from-emerald-500 to-green-700',
    duration: '3:12',
    views: '—',
    likes: '—',
    status: 'processing',
    uploadedAt: 'Just now',
  },
];

function StatusBadge({ status }) {
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Published
    </span>
  );
}

function VideoRowCard({ video, openMenuId, setOpenMenuId }) {
  const isMenuOpen = openMenuId === video.id;

  return (
    <div className="group">
      <div className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br ${video.gradient}`}>
        <span className="absolute top-3 left-3 bg-black/30 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
          {video.category}
        </span>

        <button className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </button>

        {video.status === 'published' && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
            {video.duration}
          </span>
        )}

        {/* Menu button */}
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
              <button className="w-full text-left px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Edit details
              </button>
              <button className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-gray-50">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <StatusBadge status={video.status} />
        <span className="text-xs text-gray-400">
          {video.status === 'published' ? `${video.views} · ♥ ${video.likes}` : video.uploadedAt}
        </span>
      </div>
    </div>
  );
}

export default function MyVideosPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const totalViews = '304K';
  const totalLikes = '27.1K';

  return (
    <div onClick={() => setOpenMenuId(null)}>
      <section className="px-6 sm:px-10 lg:px-16 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track performance of everything you've shared.</p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
              </svg>
              Upload video
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-md">
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{MY_VIDEOS.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Videos</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{totalViews}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total views</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{totalLikes}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total likes</p>
            </div>
          </div>

          {/* Video list */}
          {MY_VIDEOS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MY_VIDEOS.map((video) => (
                <VideoRowCard
                  key={video.id}
                  video={video}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">No videos yet</p>
              <p className="text-xs text-gray-400 mt-1">Upload your first performance to get discovered.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Upload video
              </button>
            </div>
          )}

        </div>
      </section>

      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}