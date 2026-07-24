import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useUserStore } from "@/Store/userStore";
import { Icon, CATEGORY_CONFIG } from "./mentorConfig";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import { TextUtil } from "@/lib/textUtil";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";


const SKILL_LEVELS = ["beginner", "intermediate", "advanced"];

const SKILL_BADGE = {
    beginner: "bg-gray-100 text-gray-600",
    intermediate: "bg-sky-50 text-sky-700",
    advanced: "bg-violet-50 text-violet-700",
};


const CATEGORY_FILTERS = [{ id: "all", label: "All talents" }, ...Object.entries(CATEGORY_CONFIG).map(([id, c]) => ({ id, label: c.label }))];

export default function Mentors() {
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const [queryInput, setQueryInput] = useState("");
    const [category, setCategory] = useState("all");
    const [skillLevel, setSkillLevel] = useState("all");
    const [following, setFollowing] = useState(() => new Set());
    const [mentors, setMentors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingFollow, setLoadingFollow] = useState(() => new Set());
    const PAGE_SIZE = 6;
    const debounceRef = useRef(null);
    const goToProfile = (id) => {
        navigate({ to: "/mentorProfile", search: { id } });
    };

    const toggleFollow = async (id) => {
        if (!userInfo) {
            toast.info("Log in to follow mentors");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }

        const isCurrentlyFollowing = following.has(id);

        // Optimistic update
        setFollowing((prev) => {
            const next = new Set(prev);
            isCurrentlyFollowing ? next.delete(id) : next.add(id);
            return next;
        });
        setLoadingFollow((prev) => new Set(prev).add(id));

        try {
            const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", id));
            if(res.data.isSuccess){
                console.log("follow success.")
            }
        } catch {
            // Revert on error
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

    const fetchMentors = async (page = 1, searchQuery = queryInput, cat = category, skill = skillLevel) => {
        try {
            const res = await axiosClient.get(API.AXIOS_MENTORS_GET_ALL, {
                params: {
                    page,
                    pageSize: PAGE_SIZE,
                    search: TextUtil.normalizeText(searchQuery) || undefined,
                    category: cat !== "all" ? cat : undefined,
                    skillLevel: skill !== "all" ? skill : undefined,
                },
            });
            if (res.data.isSuccess) {
                const { mentors, totalPages } = res.data.data;
                setMentors(mentors);
                setTotalPages(totalPages);
                setFollowing(new Set(mentors.filter((m) => m.isFollowing).map((m) => m.id)));
            }
        } catch {
            toast.error("Unable to load mentors");
        }
    };

    useEffect(() => {
        fetchMentors(currentPage, queryInput, category, skillLevel);
    }, [currentPage]);
        
    console.log("check mentors: ", mentors)
    const handleCategoryChange = (val) => {
        setCategory(val);
        setCurrentPage(1);
        fetchMentors(1, queryInput, val, skillLevel);
    };

    const handleSkillChange = (e) => {
        const val = e.target.value;
        setSkillLevel(val);
        setCurrentPage(1);
        fetchMentors(1, queryInput, category, val);
    };

    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQueryInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            fetchMentors(1, val, category, skillLevel);
        }, 400);
    };

    const MentorCard = ({ m, loadingFollow  }) => {
        const categoryKey = m.primaryCategory?.toLowerCase();
        const cfg = CATEGORY_CONFIG[categoryKey] ?? {
            label: m.primaryCategory,
            badgeBg: "bg-gray-100",
            badgeColor: "text-gray-600",
            icon: null,
        };
        const skillKey = m.skillLevel?.toLowerCase();
        const isFollowing = following.has(m.id);
        const isLoading = loadingFollow.has(m.id);

        return (
            <div
                onClick={() => goToProfile(m.id)}
                className="cursor-pointer border border-gray-100 rounded-xl p-4 flex flex-col hover:border-gray-200 hover:shadow-sm transition-all"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            profileImageUrl={m.profileImageUrl}
                            firstName={m.firstName}
                            lastName={m.lastName}
                            username={m.username}
                            size={44}
                            />
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {m.firstName} {m.lastName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <Icon.MapPin /> {m.provinceName}
                            </div>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${cfg.badgeBg} ${cfg.badgeColor}`}>
                        {cfg.icon} {cfg.label}
                    </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mt-3 line-clamp-3">
                    {m.bio ?? "No bio yet."}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${SKILL_BADGE[skillKey] ?? "bg-gray-100 text-gray-600"}`}>
                        {m.skillLevel}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 font-medium">
                    <span>{m.followerCount} followers</span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => goToProfile(m.id)}
                        className="cursor-pointer flex-1 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View profile
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(m.id);
                        }}
                        disabled={isLoading}
                        className={`cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                            isFollowing
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        <Icon.UserPlus />
                        {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Icon.Award /> Mentorship &amp; guidance
                    </span>
                    <h1 className="mt-4 text-2xl sm:text-[28px] font-extrabold text-gray-900">Find a mentor</h1>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl leading-relaxed">
                        Connect with experienced creators and industry professionals for feedback, guidance, and career advice across every talent category.
                    </p>
                </div>

                {/* Search + filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                    <div className="relative flex-1 max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon.Search />
                        </span>
                        <input
                            type="text"
                            value={queryInput}
                            onChange={handleQueryChange}
                            placeholder="Search mentors by name or expertise"
                            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={skillLevel}
                            onChange={handleSkillChange} 
                            className="cursor-pointer appearance-none rounded-lg border border-gray-200 pl-3 pr-8 py-2.5 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        >
                            <option value="all">All skill levels</option>
                            {SKILL_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl} className="capitalize">
                                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon.ChevronDown />
                        </span>
                    </div>
                </div>

                {/* Category chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
                    {CATEGORY_FILTERS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => handleCategoryChange(c.id)}
                            className={`cursor-pointer whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                                category === c.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <p className="text-xs text-gray-400 font-medium mb-4">{mentors.length} mentors found</p>

                {mentors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mentors.map((m) => (
                            <MentorCard key={m.id} m={m} loadingFollow={loadingFollow}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-14 text-gray-500 border border-dashed rounded-xl text-sm">
                        No mentors match your filters. Try a different category or search term.
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="cursor-pointer p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`cursor-pointer w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="cursor-pointer p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                )}



            </div>
        </section>
    );
}
