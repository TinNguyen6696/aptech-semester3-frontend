import { API } from "@/lib/apiendpoint";
import axios from "axios";
import { useState, useEffect } from "react";
import { usePublicVideos } from "@/hook/usePublicVideo";
import VideoScrollTrigger from "@/components/Trigger/videoScrollTrigger";
import PublicVideoCard from "@/components/VideoComponent/publicVideoCard";


const CATEGORY_CONFIG = {
    Singer: { emoji: "🎤" },
    Dancer: { emoji: "💃" },
    Artist: { emoji: "🎨" },
    Designer: { emoji: "🖌️" },
    Coder: { emoji: "💻" },
    Photographer: { emoji: "📷" },
};



export default function Explores(){
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { videos, isLoading, hasMore, loadMore } = usePublicVideos(selectedCategory);

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

                    {/* Search bar */}
                    {/* <div className="mt-8 flex items-center bg-white rounded-full border border-gray-200 shadow-sm pl-5 pr-2 py-2 max-w-2xl mx-auto">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="shrink-0">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Try 'fingerstyle guitar' or 'contemporary dance'"
                            className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                        />

                        <div className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border-l border-gray-200 cursor-pointer select-none">
                            All categories
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>

                        <button className="ml-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0">
                            Search
                        </button>
                    </div> */}

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
                            <PublicVideoCard key={video.id} video={video} />
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

            <section className="px-6 sm:px-10 py-10 bg-white">
                <div className="max-w-7xl mx-auto">

                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-center">

                        <div>
                        <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                            🏆 THIS WEEK'S CHALLENGE
                        </span>

                        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
                            "60-Second Solo" Contest
                        </h2>

                        <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-md">
                            Show your best in under a minute. Community-voted, judged by guest pros. Winners get featured + prizes.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <button className="bg-white hover:bg-gray-100 text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                            Enter now
                            </button>
                            <button className="bg-transparent hover:bg-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border border-white/40 transition-colors">
                            See entries
                            </button>
                        </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-white text-sm font-semibold">Live leaderboard</span>
                            <span className="text-blue-200 text-xs">2d left</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white/15 rounded-lg px-3.5 py-2.5">
                            <span className="text-white text-sm font-medium">#1  Maya Johnson</span>
                            <span className="text-white text-sm font-semibold">9,841</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg px-3.5 py-2.5">
                            <span className="text-blue-50 text-sm font-medium">#2  Dev Kapoor</span>
                            <span className="text-blue-50 text-sm font-semibold">8,302</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg px-3.5 py-2.5">
                            <span className="text-blue-50 text-sm font-medium">#3  Nadia Ahmed</span>
                            <span className="text-blue-50 text-sm font-semibold">7,658</span>
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
                            👥
                        </span>
                        <h3 className="text-base font-bold text-gray-900">Communities &amp; groups</h3>
                        </div>

                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        Join interest-based groups, share ideas on discussion boards, and team up for collabs.
                        </p>

                        <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-gray-800">Bedroom Producers</span>
                            <span className="text-xs text-gray-400">12,400 members</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-gray-800">Street Dance Crew</span>
                            <span className="text-xs text-gray-400">9,120 members</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-gray-800">Daily Sketch Club</span>
                            <span className="text-xs text-gray-400">7,030 members</span>
                        </div>
                        </div>

                        <a href="#" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Browse all communities →
                        </a>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">
                            🎓
                        </span>
                        <h3 className="text-base font-bold text-gray-900">Mentors &amp; scouts</h3>
                        </div>

                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        Book sessions with industry pros, or open your profile to scouts hiring for gigs and auditions.
                        </p>

                        <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                JL
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Jordan Lee · Music producer</p>
                                <p className="text-xs text-gray-400">Grammy-nominated · 4.9★</p>
                            </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                            Open
                            </span>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                RW
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Riya Walsh · Talent scout</p>
                                <p className="text-xs text-gray-400">Hiring dancers · 4.8★</p>
                            </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                            Hiring
                            </span>
                        </div>
                        </div>

                        <a href="#" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Find a mentor →
                        </a>
                    </div>

                    </div>

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