// src/components/Comment/comment.tsx
import { useState } from "react";
import { useUserStore } from "@/Store/userStore";
import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";
import { toast } from "react-toastify";
import DateUtil from "@/lib/dateUtil";

export default function CommentItem({ comment, onDelete }) {
    const { userInfo } = useUserStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
    const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [isSaving, setIsSaving] = useState(false);
    const [content, setContent] = useState(comment.content);

    const isOwner = userInfo?.id === comment.author?.id;
    const initials = comment.author?.username?.slice(0, 2).toUpperCase() ?? "??";

    const handleToggleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        const next = !isLiked;
        setIsLiked(next);
        setLikeCount((prev) => prev + (next ? 1 : -1));
        try {
            const res = await axiosClient.post(
                API.AXIOS_VIDEO_COMMENT_TOGGLE_LIKE.replace("{id}", comment.id)
            );
            if (!res.data.isSuccess) {
                setIsLiked(!next);
                setLikeCount((prev) => prev + (next ? -1 : 1));
                toast.error(res.data.message);
            }
        } catch {
            setIsLiked(!next);
            setLikeCount((prev) => prev + (next ? -1 : 1));
            toast.error("Unable to perform, try again later");
        } finally {
            setIsLiking(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        await onDelete(comment.id);
        setIsDeleting(false);
        setShowConfirm(false);
    };

    const handleSaveEdit = async () => {
        if (!editText.trim() || editText.trim() === comment.content) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        try {
            const res = await axiosClient.put(
                API.AXIOS_VIDEO_COMMENT_UPDATE.replace("{id}", comment.id),
                { Content: editText.trim() }
            );
            if (res.data.isSuccess) {
                setContent(editText.trim());
                setIsEditing(false);
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Unable to update comment");
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDownEdit = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        }
        if (e.key === "Escape") {
            setEditText(comment.content);
            setIsEditing(false);
        }
    };

    return (
        <>
            {/* ── Modal xác nhận xóa ── */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-80 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-center text-base font-semibold text-gray-900 mb-1">
                            Delete comment?
                        </h3>
                        <p className="text-center text-sm text-gray-500 mb-6">
                            The comment will be permanently deleted and cannot be recovered.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 group py-4">
                {/* Avatar */}
                {comment.author?.profileImageUrl ? (
                    <img
                        src={`${API.URL}${comment.author.profileImageUrl}`}
                        alt={comment.author.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                ) : (
                    <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                        {initials}
                    </span>
                )}

                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                            {comment.author?.username ?? "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {DateUtil.timeAgo(comment?.createdAt + "Z")}
                        </span>
                    </div>

                    {/* Nội dung hoặc input edit */}
                    {isEditing ? (
                        <div className="mt-1 flex gap-2">
                            <input
                                autoFocus
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={handleKeyDownEdit}
                                className="flex-1 rounded-lg border border-blue-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving || !editText.trim()}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                                {isSaving ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : "Save"}
                            </button>
                            <button
                                onClick={() => { setEditText(content); setIsEditing(false); }}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed break-words">
                            {content}
                        </p>
                    )}

                    {/* Like */}
                    <div className="mt-2 flex items-center gap-3">
                        <button
                            onClick={handleToggleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                            }`}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24"
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                                style={{ transform: isLiked ? "scale(1.15)" : "scale(1)", transition: "transform 0.15s" }}
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span>{likeCount > 0 ? likeCount : ""}</span>
                        </button>
                    </div>
                </div>

                {/* Nút edit + xóa — chỉ với chủ comment */}
                {isOwner && !isEditing && (
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                            title="Edit comment"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
                            title="Delete comment"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
