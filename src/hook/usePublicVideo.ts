import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";

const PAGE_SIZE = 6;

export function usePublicVideos(selectedCategory) {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const isFetchingRef = useRef(false);

    const fetchVideos = useCallback(async (pageToFetch, category, append) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setIsLoading(true);

        try {
            const res = await axiosClient.get(API.VIDEOS_GET_ALL_PUBLIC, {
                params: {
                    category: category === "All" ? undefined : category,
                    page: pageToFetch,
                    pageSize: PAGE_SIZE,
                },
            });

            const { videos: items, totalPages } = res.data.data;

            setVideos((prev) => (append ? [...prev, ...items] : items));
            setHasMore(pageToFetch < totalPages);
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        setPage(1);
        setVideos([]);
        setHasMore(true);
        fetchVideos(1, selectedCategory, false);
    }, [selectedCategory, fetchVideos]);

    const loadMore = useCallback(() => {
        if (!hasMore || isLoading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchVideos(nextPage, selectedCategory, true);
    }, [page, hasMore, isLoading, selectedCategory, fetchVideos]);

    return { videos, isLoading, hasMore, loadMore };
}