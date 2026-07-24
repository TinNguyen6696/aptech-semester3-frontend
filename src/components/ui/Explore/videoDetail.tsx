// src/pages/VideoDetail.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useVideoDetail } from "@/hook/useVideoDetail";
import { usePublicVideos } from "@/hook/usePublicVideo";
import { useUserStore } from "@/Store/userStore";
import RelatedVideoCard from "@/components/VideoComponent/relateVideoCard";
import CommentItem from "@/components/Comment/comment";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import { toast } from "react-toastify";
import { StringValue } from "@/lib/stringValue";
import VideoScrollTrigger from "@/components/Trigger/videoScrollTrigger";
import DateUtil from "@/lib/dateUtil";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";

export default function VideoDetail({ id }) {
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const { video, comments, setComments, isLoading, refetch } = useVideoDetail(id);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const videoRef = useRef(null);
    const [hasCountedView, setHasCountedView] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportText, setReportText] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        if (video) {
            setIsLiked(video.isLiked ?? false);
            setLikeCount(video.likeCount ?? 0);
            setViewCount(video.viewCount ?? 0);
            setIsFollowing(video.owner?.isFollowing ?? false);
            setIsReported(video.isReported ?? false);
            setFollowerCount(video.owner?.followerCount ?? 0);
        }
    }, [video]);
    const category = useMemo(() => video?.category ?? "All", [video?.category]);
    const {
        videos: sidebarVideos,
        isLoading: isSidebarLoading,
        hasMore: sidebarHasMore,
        loadMore: sidebarLoadMore,
    } = usePublicVideos(category);

    const relatedVideos = useMemo(
        () => sidebarVideos.filter((v) => v.id !== id),
        [sidebarVideos, id]
    );

    //View Count
    const countView = async () => {
        try {
            const res = await axiosClient.post(
                API.AXIOS_VIDEO_VIEW_INSERT.replace("{id}", id)
            );
            if(res.data.isSuccess){
                setViewCount(prev => prev + 1);
            }
        } catch (error) {
            console.log("Cannot count view");
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || hasCountedView) return;

        const currentTime = videoRef.current.currentTime;

        if (currentTime >= 3) {
            countView();
            setHasCountedView(true);
        }
    };

    //Like
    const handleToggleLike = async () => {
        if (!userInfo) {
            toast.info("Log in to like");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        if (userInfo.role === StringValue.RECRUITER) {
            toast.info("Recruiters can't like videos");
            return;
        }
        if (isLiking) return;
        setIsLiking(true);

        const nextIsLiked = !isLiked;
        setIsLiked(nextIsLiked);
        setLikeCount((prev) => prev + (nextIsLiked ? 1 : -1));

        try {
            const res = await axiosClient.post(API.AXIOS_VIDEO_TOGGLE_LIKE.replace("{id}", id))

            if (!res.data.isSuccess) {
                setIsLiked(!nextIsLiked);
                setLikeCount((prev) => prev + (nextIsLiked ? -1 : 1));
                toast.error(res.data.message);
            }
        } catch {
            setIsLiked(!nextIsLiked);
            setLikeCount((prev) => prev + (nextIsLiked ? -1 : 1));
            toast.error("Unable to perform, try again later");
        } finally {
            setIsLiking(false);
        }
    };
    const handleSubmitComment = async () => {
        if (!userInfo) {
            toast.info("Log in to comment");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await axiosClient.post(
                API.AXIOS_VIDEO_COMMENT_INSERT.replace("{id}", id),
                { Content: commentText.trim() }
            );
            if (res.data.isSuccess) {
                setComments((prev) => [res.data.data, ...prev]);
                setCommentText("");
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Unable to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await axiosClient.delete(
                API.AXIOS_VIDEO_COMMENT_DELETE.replace("{id}", commentId)
            );
            if (res.data.isSuccess) {
                toast.success("Comment removed successfully!")
                setComments((prev) => prev.filter((c) => c.id !== commentId));
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Unable to delete comment");
        }
    };

    //Keyboard
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    //Follow
    const toggleFollow = async () => {
        if (!userInfo) {
            toast.info("Log in to follow");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        const prevFollowing = isFollowing;
        const prevCount = followerCount;

        setIsFollowing(!prevFollowing);
        setFollowerCount((prev) => prev + (!prevFollowing ? 1 : -1));
        setIsLoadingFollow(true);

        try {
            const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", video.owner?.id));
            if (!res.data.isSuccess) {
                setIsFollowing(prevFollowing);
                setFollowerCount(prevCount);
                toast.error(res.data.message);
            }
        } catch {
            setIsFollowing(prevFollowing);
            setFollowerCount(prevCount);
            toast.error("Failed to update follow status");
        } finally {
            setIsLoadingFollow(false);
        }
    };

    console.log("check video : ", video)
    //Report 
    const handleSubmitReport = async () => {
        if (!reportText.trim()) return;
        setIsReporting(true);
        try {
            const res = await axiosClient.post(
                API.AXIOS_VIDEO_REPORT_INSERT.replace("{id}", id),
                { Description: reportText.trim() }
            );
            if (res.data.isSuccess) {
                toast.success("Report submitted");
                setIsReportOpen(false);
                setReportText("");
                setIsReported(true);
            } else {
                toast.error(res.data.message);
            }
        } catch(error) {
            toast.error(error.response?.data?.message );
        } finally {
            setIsReporting(false);
        }
    };

    
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="text-center py-20 text-gray-500">
                Video not found
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                {/* ── Cột chính ── */}
                <div>
                    {/* Video player */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            src={`${API.URL}${video.videoUrl}`}
                            className="w-full h-full"
                            controls
                            autoPlay
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>

                    <h1 className="mt-4 text-xl font-bold text-gray-900">
                        {video.title}
                    </h1>
                    <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm text-gray-500">
                            {viewCount} views · {DateUtil.timeAgo(video?.createdAt+'Z')}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleToggleLike}
                                disabled={isLiking}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                                    isLiked
                                        ? "bg-red-50 text-red-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={isLiked ? "#DC2626" : "none"}
                                    stroke={isLiked ? "#DC2626" : "currentColor"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        transform: isLiked ? "scale(1.1)" : "scale(1)",
                                        transition: "transform 0.15s",
                                    }}
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                {likeCount}
                            </button>

                            <button
                                onClick={() => setIsReportOpen(true)}
                                disabled={isReported}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isReported
                                        ? "bg-red-50 text-red-400"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                }`}
                                title={isReported ? "Already reported" : "Report video"}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                    <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                                {isReported ? "Reported" : "Report"}
                            </button>

                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                {video.category}
                            </span>
                        </div>
                    </div>

                    {/* Owner info */}
                    <div className="mt-4 flex items-center justify-between border-t border-b border-gray-100 py-4">
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                                if (video.owner?.id) navigate({ to: "/mentorProfile", search: { id: video.owner.id } });
                            }}
                        >
                            <UserAvatar
                                profileImageUrl={video.owner?.profileImageUrl}
                                username={video.owner?.username}
                                size={44}
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline">
                                    {video.owner?.username}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {followerCount} followers
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleFollow}
                            disabled={isLoadingFollow}
                            className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                isFollowing
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {isLoadingFollow ? "..." : isFollowing ? "Following" : "Follow"}
                        </button>
                    </div>

                    {video.description && (
                        <div className="mt-4 bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {video.description}
                            </p>
                        </div>
                    )}

                    <div className="mt-8">
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                            {comments.length} comments
                        </h3>

                        <div className="flex gap-3 mb-6">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write a comment... (Enter to send)"
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={isSubmitting || !commentText.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                {isSubmitting ? "Sending..." : "Post"}
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto pr-1 comment-scroll">
                            {comments?.length > 0 ? (
                                comments?.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onDelete={handleDeleteComment}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    No comments yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">
                        Related videos
                    </h3>
                    <div className="space-y-4">
                        {relatedVideos.length > 0 ? (
                            relatedVideos.map((v) => (
                                <RelatedVideoCard key={v.id} video={v} />
                            ))
                        ) : !isSidebarLoading ? (
                            <p className="text-sm text-gray-400">
                                No related videos
                            </p>
                        ) : null}
                    </div>

                    {isSidebarLoading && (
                        <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <VideoScrollTrigger
                        onIntersect={sidebarLoadMore}
                        disabled={!sidebarHasMore || isSidebarLoading}
                    />
                </div>
            </div>

             {isReportOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setIsReportOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Report video</h2>
                            <button
                                onClick={() => setIsReportOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                            Tell us why you're reporting this video.
                        </p>
                        <textarea
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Describe the issue..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsReportOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={isReporting || !reportText.trim()}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {isReporting ? "Submitting..." : "Submit report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}       

        </div>
    );
}
