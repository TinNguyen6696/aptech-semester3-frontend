import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import axios from "axios";
import { API } from "@/lib/apiendpoint";
import AddPostModal from "./addPostModal";
import { StringValue } from "@/lib/stringValue";
import DateUtil from "@/lib/dateUtil";
import { getSingleCategoryConfig } from "./categoryConfig";
import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "@/Store/userStore";
import axiosClient from "@/services/axiosClient";

const PAGE_SIZE = 5;

function PostCard({ post, communityId, canInteract }) {
    const author = post?.author;
    const commentCount = post.commentCount ?? 0;
    const [liked, setLiked] = useState(post.isLiked ?? false);
    const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate({
            to: "/postDetail",
            search: { id: post.id },
            state: { post } as any,
        });
    };

    return (
        <div 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick();
            }}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 cursor-pointer"
            >
            <div className="flex items-center gap-3 mb-3">
                <img 
                    src={`${API.URL}${author.profileImageUrl}`} 
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium`} 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = StringValue.USER_AVATAR_DEFAULT;
                    }}
                    />                         
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{author.username}</span>
                        {post.author?.role && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                {post.author.role}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">{DateUtil.timeAgo(post.createdAt+'Z')}</p>
                </div>
            </div>

            {post.title && (
                <p className="text-sm font-medium text-gray-900 mb-1">{post.title}</p>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.content}</p>

                        <div className="border-t border-gray-100 pt-2 flex items-center gap-3 text-sm text-gray-500">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!canInteract || isLiking) return;
                        const wasLiked = liked;
                        setIsLiking(true);
                        setLiked(!wasLiked);
                        setLikeCount((prev) => wasLiked ? prev - 1 : prev + 1);
                        axiosClient.post(API.AXIOS_COMMUNITY_POST_COMMENT_LIKE.replace("{id}", post.id))
                            .then((res) => { if (!res.data.isSuccess) throw new Error(); })
                            .catch(() => { setLiked(wasLiked); setLikeCount((prev) => wasLiked ? prev + 1 : prev - 1); })
                            .finally(() => setIsLiking(false));
                    }}
                    disabled={!canInteract || isLiking}
                    className={`flex items-center gap-1 transition-colors disabled:cursor-not-allowed ${
                        liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                    }`}
                >
                    <Heart
                        size={15}
                        className={`transition-transform duration-150 ${liked ? "scale-110 fill-red-500" : "scale-100 fill-none"}`}
                        strokeWidth={liked ? 0 : 2}
                    />
                    <span className="text-xs font-medium">{likeCount}</span>
                </button>

                <span>·</span>
                <span>{commentCount} {commentCount === 1 ? "comment" : "comments"}</span>

                {!canInteract && (
                    <span className="text-xs text-red-400">(Recruiter cannot interact)</span>
                )}
            </div>
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

export default function CommunityBoard({ id }) {
    const {userInfo } = useUserStore();
    const role = userInfo?.role;
    const canInteract = role !== StringValue.RECRUITER;
    console.log("check role: ", role)
    const [community, setCommunity] = useState(null);
    const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isAddingPost, setIsAddingPost] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchCommunity = async () => {
            setIsLoadingCommunity(true);
            try {
                const url = API.COMMUNITY_GET_BY_ID.replace("{id}", id);
                const response = await axiosClient.get(url);
                setCommunity(response.data.data ?? null);
            } catch (error) {
                console.error("Error fetching community:", error);
            } finally {
                setIsLoadingCommunity(false);
            }
        };
        fetchCommunity();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchPosts = async () => {
            setIsLoadingPosts(true);
            try {
                const url = API.COMMUNITY_POSTS_GET_ALL.replace("{id}", id);
                const response = await axiosClient.get(url, {
                    params: { page: currentPage, pageSize: PAGE_SIZE },
                });
                const data = response.data.data ?? {};
                setPosts(data.posts ?? []);
                setTotalPages(data.totalPages ?? 1);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoadingPosts(false);
            }
        };
        fetchPosts();
    }, [id, currentPage]);
    const handlePostCreated = async (newPost) => {
        setCurrentPage(1);
        setIsAddingPost(false);
        setIsLoadingPosts(true);
        try {
            const url = API.COMMUNITY_POSTS_GET_ALL.replace("{id}", id);
            const response = await axiosClient.get(url, { params: { page: 1, pageSize: PAGE_SIZE } });
            const data = response.data.data ?? {};
            setPosts(data.posts ?? []);
            setTotalPages(data.totalPages ?? 1);
        } catch (error) {
            console.error("Error refetching posts:", error);
        } finally {
            setIsLoadingPosts(false);
        }
    };
    console.log("check post: ", posts)
    const categoryCfg = getSingleCategoryConfig(community?.category);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-start justify-between gap-4 pb-5">
                <div className="flex items-center gap-4">
                    <div className={`w-[52px] h-[52px] rounded-xl ${categoryCfg.iconBg} flex items-center justify-center`}>
                        {categoryCfg.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-medium text-gray-900">
                                {isLoadingCommunity ? "Loading…" : community?.name ?? "Community"}
                            </h1>
                            {community?.category && (
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryCfg.badgeBg} ${categoryCfg.badgeColor}`}>
                                    {categoryCfg.label}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {community?.description || "Browse posts in this community."}
                        </p>
                    </div>
                </div>

                {role !== StringValue.MEMBER && role !== StringValue.RECRUITER && (
                    <button
                        onClick={() => setIsAddingPost(true)}
                        className="cursor-pointer shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add post
                    </button>
                )}
            </div>

            <hr className="border-gray-200 mb-5" />

            {isLoadingPosts ? (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400">
                    Loading posts…
                </div>
            ) : posts.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} communityId={post.communityId} canInteract={canInteract}/>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                    <p className="text-sm font-semibold text-gray-700">No posts yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to post in this community.</p>
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {isAddingPost && (
                <AddPostModal
                    communityId={id}
                    onClose={() => setIsAddingPost(false)}
                    onCreated={handlePostCreated}
                />
            )}
        </div>
    );
}
