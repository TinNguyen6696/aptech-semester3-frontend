// src/hook/useVideoDetail.ts
import { useState, useEffect, useCallback } from "react";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";

export function useVideoDetail(videoId) {
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [videoRes, commentsRes] = await Promise.all([
                axiosClient.get(API.VIDEO_GET_BY_ID.replace("{id}", videoId)),
                axiosClient.get(API.AXIOS_VIDEO_COMMENT_GET_ALL.replace("{id}", videoId)),
            ]);

            setVideo(videoRes.data.data);
            const raw = commentsRes.data.data;
            setComments(raw?.comments ?? raw ?? []);
        } catch (error) {
            console.error("Failed to fetch video detail:", error);
        } finally {
            setIsLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { video, relatedVideos, comments, setComments, isLoading, refetch: fetchAll };
}
