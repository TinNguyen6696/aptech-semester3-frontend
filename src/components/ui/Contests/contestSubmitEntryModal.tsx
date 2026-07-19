import { useState } from "react";
import { IconContestDetail } from "./contestCategoryConfig";
import VideoSelectCard from "./contestVideoSelectCard";
import VideoExpandModal from "./videoExpandModal";



export default function SubmitEntryModal({ open, onClose, myVideos, loading, selectedVideoId, onSelect, onSubmit, submitting }) {
    const [expandedVideo, setExpandedVideo] = useState(null);
    if (!open) return null;

    const hasVideos = (myVideos ?? []).length > 0;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />

                <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 max-h-[90vh] flex flex-col">
                    <div className="flex items-start justify-between mb-1 flex-shrink-0">
                        <h2 className="text-lg font-bold text-gray-900">Submit your video</h2>
                        <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600 p-1" aria-label="Close">
                            <IconContestDetail.Close className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 flex-shrink-0">Choose one of your videos to enter this contest.</p>

                    <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                        {loading ? (
                            <div className="py-10 text-center text-sm text-gray-400">Loading your videos...</div>
                        ) : hasVideos ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(myVideos ?? []).map((video) => (
                                    <VideoSelectCard
                                        key={video.id}
                                        video={video}
                                        isSelected={selectedVideoId === video.id}
                                        onSelect={onSelect}
                                        onExpand={setExpandedVideo}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
                                <p className="text-sm font-semibold text-gray-700">No videos available</p>
                                <p className="text-xs text-gray-400 mt-1">You need to upload a video before joining this contest.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 flex-shrink-0 border-t border-gray-100 mt-4">
                        <button onClick={onClose} className="cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(selectedVideoId)}
                            disabled={!selectedVideoId || submitting}
                            className="cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit entry"}
                        </button>
                    </div>
                </div>
            </div>

            <VideoExpandModal video={expandedVideo} onClose={() => setExpandedVideo(null)} />
        </>
    );
}