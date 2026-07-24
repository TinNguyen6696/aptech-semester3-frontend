import { useCallback, useEffect, useState } from 'react';
import UploadVideoModal from '@/components/Model/UploadVideo/uploadVideoModal';
import axiosClient from '@/services/axiosClient';
import { API } from '@/lib/apiendpoint';
import { toast } from 'react-toastify';
import VideoCard from '@/components/Model/UploadVideo/videoCard';
import ConfirmDeleteModal from '@/components/Model/UploadVideo/confirmDeleteVideo';
import EditVideoModal from '@/components/Model/UploadVideo/editVideoModal';

const MAX_VIDEOS = 3;

export default function MyVideosPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const totalViews = videos.reduce((sum, v) => sum + (v.viewCount ?? 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likeCount ?? 0), 0);
  const isLimitReached = videos.length >= MAX_VIDEOS;
  const bannedCount = videos.filter((v) => v.isRemovedByAdmin).length;
  const visibleVideos = activeTab === 'banned' ? videos.filter((v) => v.isRemovedByAdmin) : videos;
  const fetchVideos = useCallback(async () => {
    try {
      const res = await axiosClient.get(API.AXIOS_VIDEO_GET_ALL);
      if (res.data.isSuccess) {
        setVideos(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleOpenUpload = () => {
    if (isLimitReached) {
      toast.error(`You can only upload up to ${MAX_VIDEOS} videos.`);
      return;
    }
    setIsUploadModalOpen(true);
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setVideoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    setIsDeleting(true);
    try {
      console.log(videoToDelete.id)
      const res = await axiosClient.delete(API.AXIOS_VIDEO_DELETE.replace("{id}",videoToDelete.id));
      if (res.data.isSuccess) {
        toast.success('Video deleted successfully.');
        setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
      } else {
        toast.error(res.data.message || 'Failed to delete video.');
      }
    } catch (error) {
      toast.error('Something went wrong while deleting the video.');
    } finally {
      setIsDeleting(false);
      setVideoToDelete(null);
    }
  };
  const handleEditClick = (video) => {
    setVideoToEdit(video);
  };

  return (
    <div onClick={() => setOpenMenuId(null)}>
      <section className="px-6 sm:px-10 lg:px-16 py-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track performance of everything you've shared.</p>
            </div>

            <button
              onClick={handleOpenUpload}
              disabled={isLimitReached}
              className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm ${
                            isLimitReached
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
              </svg>
              {isLimitReached ? 'Limit reached (3/3)' : 'Upload video'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 max-w-md">
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{videos.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Videos</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total views</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xl font-extrabold text-gray-900">{totalLikes.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total likes</p>
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              All videos
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'banned'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Banned
              {bannedCount > 0 && (
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {bannedCount}
                </span>
              )}
            </button>
          </div>

          {visibleVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onDeleteClick={handleDeleteClick}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          ) : activeTab === 'banned' ? (
            <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
              <p className="text-sm font-semibold text-gray-700">No banned videos</p>
              <p className="text-xs text-gray-400 mt-1">Videos removed for violating guidelines will show up here.</p>
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
                onClick={handleOpenUpload}
                disabled={isLimitReached}
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
        onUploadSuccess={() => {
          setIsUploadModalOpen(false);
          fetchVideos();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!videoToDelete}
        video={videoToDelete}
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <EditVideoModal
        isOpen={!!videoToEdit}
        video={videoToEdit}
        onClose={() => setVideoToEdit(null)}
        onUpdateSuccess={() => {
          setVideoToEdit(null);
          fetchVideos();
        }}
      />
    </div>
  );
}