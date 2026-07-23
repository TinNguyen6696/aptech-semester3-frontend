import { API } from "@/lib/apiendpoint";
import axios from "axios";
import { useState, useEffect } from "react";
import { usePublicVideos } from "@/hook/usePublicVideo";
import VideoScrollTrigger from "@/components/Trigger/videoScrollTrigger";
import PublicVideoCard from "@/components/VideoComponent/publicVideoCard";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "@/Store/userStore";
import axiosClient from "@/services/axiosClient";


const CATEGORY_CONFIG = {
    Singer: { emoji: "🎤" },
    Dancer: { emoji: "💃" },
    Artist: { emoji: "🎨" },
    Designer: { emoji: "🖌️" },
    Coder: { emoji: "💻" },
    Photographer: { emoji: "📷" },
};



export default function Explores(){
    const navigate = useNavigate();
    const {userInfo} = useUserStore();
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { videos, isLoading, hasMore, loadMore } = usePublicVideos(selectedCategory);
    const [following, setFollowing] = useState(() => new Set());
    const [loadingFollow, setLoadingFollow] = useState(() => new Set());
    useEffect(() => {
      const fetchOptions = async () => {
        try {
          const response = await axios.get(API.OPTION_GET_ALL)
          setOptions(response.data.data)
        } catch (error) {
          console.error("Error fetching options:", error)
        }
      }

      fetchOptions()
    }, [])  

    console.log("check options: ", options)

    const toggleFollow = async (id) => {
        if (!userInfo) {
            toast.info("Log in to follow mentors");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }

        const isCurrentlyFollowing = following.has(id);

        setFollowing((prev) => {
            const next = new Set(prev);
            isCurrentlyFollowing ? next.delete(id) : next.add(id);
            return next;
        });
        setLoadingFollow((prev) => new Set(prev).add(id));

        try {
            const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", id));
            if (res.data.isSuccess) {
                console.log("follow success.");
            }
        } catch {
            setFollowing((prev) => {
                const next = new Set(prev);
                isCurrentlyFollowing ? next.add(id) : next.delete(id);
                return next;
            });
            toast.error("Failed to update follow status");
        } finally {
            setLoadingFollow((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };
    console.log("check video: ", videos)

    return (
        <>
            <section className="relative bg-gradient-to-b from-slate-50 to-white px-6 py-24 text-center">
                <div className="max-w-3xl mx-auto">

                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 bg-white text-blue-600 text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    2,400 new videos uploaded this week
                    </span>

                    {/* Heading */}
                    <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                    Discover talent worth<br />
                    watching — and be discovered.
                    </h1>

                    {/* Subtext */}
                    <p className="mt-5 text-gray-500 text-[15px] leading-relaxed max-w-xl mx-auto">
                    Search thousands of performances across music, dance, art, coding and more.
                    Find creators, give feedback, get noticed.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="text-gray-400 mr-1">Popular:</span>
                    {["Beatboxing", "Spoken word", "Pixel art", "Standup"].map((tag) => (
                        <button
                        key={tag}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors"
                        >
                        {tag}
                        </button>
                    ))}
                    </div>

                    <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
                    {[
                        { value: "50K+", label: "Creators" },
                        { value: options.talentCategories?.length.toString() ?? "0", label: "Categories" },
                        { value: "800+", label: "Mentors & scouts" },
                        { value: "2.4M", label: "Feedback given" },
                    ].map((stat) => (
                        <div key={stat.label}>
                        <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                    </div>

                </div>
            </section>
            
            <div className="border-b border-gray-100 px-6 sm:px-10 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`shrink-0 text-sm cursor-pointer font-semibold px-4 py-2 rounded-full transition-colors ${
                            selectedCategory === "All"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        All
                    </button>
                    {options.talentCategories?.map((cate) => {
                        const config = CATEGORY_CONFIG[cate] ?? { emoji: "🔖" };
                        const isSelected = selectedCategory === cate;
                        return (
                            <button
                                key={cate}
                                onClick={() => setSelectedCategory(cate)}
                                className={`shrink-0 flex cursor-pointer items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                                    isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                {config.emoji} {cate}
                            </button>
                        );
                    })}

                </div>
            </div>
          
            <section className="px-6 sm:px-10 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCategory === "All" ? "Trending this week" : `${selectedCategory} videos`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <PublicVideoCard 
                                key={video.id} 
                                video={video} 
                                isFollowing={following.has(video.owner?.id)}
                                isLoadingFollow={loadingFollow.has(video.owner?.id)}
                                onFollow={() => toggleFollow(video.owner?.id)}
                                />
                        ))}
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <VideoScrollTrigger onIntersect={loadMore} disabled={!hasMore || isLoading} />

                    {!hasMore && videos.length > 0 && (
                        <p className="text-center text-sm text-gray-400 py-8">You've reached the end of the list</p>
                    )}

                    {!isLoading && videos.length === 0 && (
                        <p className="text-center text-sm text-gray-400 py-8">No videos found</p>
                    )}
                </div>
            </section>   
            <section className="px-6 sm:px-10 py-16 bg-white">
                <div className="max-w-7xl mx-auto">

                    <h2 className="text-2xl sm:text-[26px] font-bold text-gray-900 text-center mb-10">
                    Get started in three steps
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div className="border border-gray-100 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2.5 mb-5">
                        <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            1
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5"/>
                            <path d="M5 12l7-7 7 7"/>
                        </svg>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-1.5">Upload your talent</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                        Post a video of your performance and tag it by category.
                        </p>
                    </div>

                    <div className="border border-gray-100 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2.5 mb-5">
                        <span className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                            2
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-1.5">Get real feedback</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                        The community comments, rates and votes to help you grow.
                        </p>
                    </div>

                    <div className="border border-gray-100 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2.5 mb-5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                            3
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"/>
                        </svg>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-1.5">Get discovered</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                        Mentors and scouts reach out with real opportunities.
                        </p>
                    </div>

                    </div>
                </div>
              </section>      
        </>
    )
}