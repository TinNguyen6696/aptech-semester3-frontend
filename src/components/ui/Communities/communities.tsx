import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { API } from "@/lib/apiendpoint";
import {
    buildCategoryConfig,
    normalizeCategoryKey,
    FALLBACK_CATEGORY_CONFIG,
} from "./categoryConfig";

export default function Communities() {
    const [communities, setCommunities] = useState([]);
    const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            setIsLoadingCommunities(true);
            try {
                const response = await axios.get(API.COMMUNITY_GET_ALL);
                setCommunities(response.data.data ?? []);
            } catch (error) {
                console.error("Error fetching communities:", error);
            } finally {
                setIsLoadingCommunities(false);
            }
        };
        fetchCommunities();
    }, []);

    const categoryConfigMap = useMemo(() => buildCategoryConfig(communities), [communities]);

    const goToCommunity = (id) => {
        navigate({ to: "/communityBoard", search: { id } });
    };

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        One discussion board per talent category. Browse freely, no membership needed.
                    </p>
                </div>

                {isLoadingCommunities ? (
                    <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400">
                        Loading communities…
                    </div>
                ) : communities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {communities.map((c) => {
                            const cfg = categoryConfigMap[normalizeCategoryKey(c.category)] ?? FALLBACK_CATEGORY_CONFIG;
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => goToCommunity(c.id)}
                                    className="cursor-pointer border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all"
                                >
                                    <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} flex items-center justify-center`}>
                                        {cfg.icon}
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-bold text-gray-900">{c.name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {c.description || "No description yet."}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-1">{c.postCount ?? 0} posts</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                        <p className="text-sm font-semibold text-gray-700">No communities found</p>
                        <p className="text-xs text-gray-400 mt-1">Check back later.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
