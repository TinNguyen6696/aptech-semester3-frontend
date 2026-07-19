import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Send, Heart } from "lucide-react";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { API } from "@/lib/apiendpoint";
import { StringValue } from "@/lib/stringValue";
import DateUtil from "@/lib/dateUtil";
import axiosClient from "@/services/axiosClient";
import { useUserStore } from "@/Store/userStore";
import { toast } from "react-toastify";
import { useUserStore } from "@/Store/userStore";

const PAGE_SIZE = 5;

function Avatar({ author, size = "w-9 h-9" }) {
    return (
        <img
            src={`${API.URL}${author?.profileImageUrl ?? ""}`}
            className={`${size} rounded-full object-cover shrink-0`}
            onError={(e) => {
                (e.target as HTMLImageElement).src = StringValue.USER_AVATAR_DEFAULT;
            }}
        />
    );
}

function LikeButton({ liked, likeCount, onToggle, isSubmitting }) {
    return (
        <button
            onClick={onToggle}
            disabled={isSubmitting}
            className={`cursor-pointer flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
            }`}
        >
            <Heart
                size={18}
                className={liked ? "fill-red-500" : "fill-none"}
                strokeWidth={liked ? 0 : 2}
            />
            {likeCount}
        </button>
    );
}

function CommentCard({ comment }) {
    const author = comment?.author;
    const validDate = DateUtil.toValidDate(comment.createdAt);

    return (
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
                <Avatar author={author} size="w-8 h-8" />
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{author?.username}</span>
                        {author?.role && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                {author.role}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">
                        {validDate ? DateUtil.timeAgo(validDate) : "Just now"}
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium border ${
                        page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

export default function PostDetail({ id, initialData }) {
    const router = useRouter();
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const [post, setPost] = useState(initialData ?? null);
    const [isLoadingPost, setIsLoadingPost] = useState(!initialData);
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [liked, setLiked] = useState(initialData?.isLiked ?? false);
    const [likeCount, setLikeCount] = useState(initialData?.likeCount ?? 0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (initialData) return;
        if (!id) return;

        // const fetchPost = async () => {
        //     setIsLoadingPost(true);
        //     try {
        //         const url = API.COMMUNITY_POST_GET_BY_ID.replace("{id}", id);
        //         const response = await axios.get(url);
        //         setPost(response.data.data ?? null);
        //     } catch (error) {
        //         console.error("Error fetching post:", error);
        //     } finally {
        //         setIsLoadingPost(false);
        //     }
        // };
        // fetchPost();
    }, [id, initialData]);

    // Keep like state in sync if post loads/changes after initial render
    useEffect(() => {
        if (!post) return;
        setLiked(post.isLiked ?? false);
        setLikeCount(post.likeCount ?? 0);
    }, [post]);

    const fetchComments = async (page) => {
        setIsLoadingComments(true);
        try {
            const res = await axiosClient.get(API.AXIOS_COMMUNITY_POST_COMMENT_GET_ALL.replace("{id}", id), {
                params: { page, pageSize: PAGE_SIZE },
            });
            if(res.data.isSuccess){
                 const data = res.data.data ?? {};
                setComments(data.comments ?? []);
                setTotalPages(data.totalPages ?? 1);
            }
           
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchComments(currentPage);
    }, [id, currentPage]);

    const handleSubmitComment = async () => {
        // Guest guard: don't submit; send them to login first.
        if (!userInfo) {
            toast.info("Log in to comment");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        if (!newComment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const req = {
                Content: newComment.trim()
            }
            const res = await axiosClient.post(API.AXIOS_COMMUNITY_POST_COMMENT_INSERT.replace("{id}", id), req);
            if(res.data.isSuccess){
                setNewComment("");
                setCurrentPage(1);
                fetchComments(1);
                setPost((prev) => prev ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 } : prev);
                toast.success("Add comment successfully!");
            }
            
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleLike = async () => {
        if (isLiking || !id) return;
        setIsLiking(true);
        const prevLiked = liked;
        const prevCount = likeCount;
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikeCount((c) => c + (nextLiked ? 1 : -1));

        try {
            const res = await axiosClient.post(
                API.AXIOS_COMMUNITY_POST_COMMENT_LIKE.replace("{id}", id)
            );
            if (!res.data.isSuccess) {
                throw new Error("Like toggle failed");
            }
        } catch (error) {
            setLiked(prevLiked);
            setLikeCount(prevCount);
            console.error("Error toggling like:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLiking(false);
        }
    };

    const author = post?.author;
    const validPostDate = DateUtil.toValidDate(post?.createdAt);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <button
                onClick={() => router.history.back()}
                className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"
            >
                <ArrowLeft size={16} />
                Back to community
            </button>

            {isLoadingPost ? (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400">
                    Loading post…
                </div>
            ) : post ? (
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar author={author} />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{author?.username}</span>
                                {author?.role && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                        {author.role}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">
                                {validPostDate ? DateUtil.timeAgo(validPostDate) : "Just now"}
                            </p>
                        </div>
                    </div>

                    {post.title && (
                        <p className="text-base font-semibold text-gray-900 mb-1.5">{post.title}</p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                        {post.content}
                    </p>

                    <div className="border-t border-gray-100 pt-2 flex items-center gap-4">

                        {role === StringValue.RECRUITER ? (
                            <span className="text-sm text-gray-500">
                                {likeCount} likes
                            </span>
                        ) : (
                            <LikeButton
                                liked={liked}
                                likeCount={likeCount}
                                onToggle={handleToggleLike}
                                isSubmitting={isLiking}
                            />
                        )}

                        <span className="text-sm text-gray-500">
                            {post.commentCount ?? 0} {(post.commentCount ?? 0) === 1 ? "comment" : "comments"}
                        </span>

                    </div>
                </div>
            ) : (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400">
                    Post not found.
                </div>
            )}

            {userInfo ? (
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                        placeholder="Write a comment…"
                        className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                    />
                    <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmitting}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send size={14} />
                        Send
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-400">Log in to join the conversation.</span>
                    <button
                        onClick={() => navigate({ to: "/login", search: { redirect: location.href } })}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Log in
                    </button>
                </div>
            )}

            <p className="text-sm font-medium text-gray-900 mb-3">
                Comments {post?.commentCount != null ? `(${post.commentCount})` : ""}
            </p>

            {isLoadingComments ? (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400">
                    Loading comments…
                </div>
            ) : comments.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {comments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                    <p className="text-sm font-semibold text-gray-700">No comments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to comment on this post.</p>
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}