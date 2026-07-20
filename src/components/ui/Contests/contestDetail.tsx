import { useEffect, useMemo, useRef, useState } from "react";
import { IconContestDetail, STATUS_CONFIG, RANK_STYLE, CATEGORY_CONFIG_DETAIL, getStatus } from "./contestCategoryConfig";
import axios from "axios";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import DeleteConfirmModal from "./deleteConfirmModal";
import UpcomingBanner from "./upComingBaner";
import ContestVideoCard from "./contestVideoCard";
import LeaderboardRow from "./contestLeaderBoard";
import WinnerPodium from "./contestWinnerPodium";
import SubmitEntryModal from "./contestSubmitEntryModal";
import VideoExpandModal from "./videoExpandModal";
import DateUtil from "@/lib/dateUtil";
import { useUserStore } from "@/Store/userStore";
import { StringValue } from "@/lib/stringValue";

export default function ContestDetail({ onBack, id }) {
    const {userInfo} = useUserStore();
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [contest, setContest] = useState<any>(null);
    const [ownVideos, setOwnVideos] = useState([]);
    const [entries, setEntries] = useState<any[]>([]);
    const [openedEntry, setOpenedEntry] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchEntries = async ()=>{
            const res = await axiosClient.get(API.AXIOS_CONTEST_ENTRIES_GET_ALL.replace("{id}",id));
            if(res.data.isSuccess){
                
                setEntries(res.data.data.entries);
            }
        };

    useEffect(()=>{
        if (!userInfo) return;
        const fetchOwnVideos = async ()=>{
            try {
                const res = await axiosClient.get(API.AXIOS_VIDEO_GET_ALL);
                if(res.data.isSuccess){
                    const mapped = (res.data.data ?? []).map((v) => ({
                        id: v.id,
                        videoTitle: v.title,
                        thumbnail: v.thumbnailUrl ?? null,
                        videoUrl: `${API.URL}${v.videoUrl}`,
                        category: v.category,
                        visibility: v.visibility,
                    }));
                    setOwnVideos(mapped);
                }
            } catch (error) {
                console.error("Error fetching own videos:", error);
            }
        };
        fetchOwnVideos();
    },[userInfo])

    const handleDelete = async () => {
        if (!deletingEntryId) return;
        setDeleteLoading(true);
        try {
            const res = await axiosClient.delete(
                        API.AXIOS_CONTEST_ENTRIES_DELETE
                            .replace("{id}", id)
                            .replace("{entryId}", deletingEntryId)
                    );
            if (res.data.isSuccess) {
                toast.success("Entry deleted successfully.");
                setDeletingEntryId(null);
                fetchEntries();
            }
        } catch (err) {
            toast.error("Could not delete entry. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(()=>{
        fetchEntries();
    },[id])
    const entriesWithMine = useMemo(() => {
        const ownVideoIds = new Set(ownVideos.map((v) => v.id));
        return entries.map((e) => ({
            ...e,
            mine: ownVideoIds.has(e.videoId),
        }));
    }, [entries, ownVideos]);

    useEffect(()=>{
        const fetchContest = async ()=>{
            const res = await axiosClient.get(API.AXIOS_CONTEST_GET_BY_ID.replace("{id}", id));
            if(res.data.isSuccess){
                setContest(res.data.data);
            }
        };
        fetchContest();
    },[id])

    const handleVote = async (entryId) => {
        if (!userInfo) {
            toast.info("Log in to vote");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        setEntries((prev) =>
            prev.map((e) =>
                e.id === entryId
                    ? {  ...e,
                        isVoted: !e.isVoted,
                        voteCount: e.isVoted
                            ? e.voteCount - 1
                            : e.voteCount + 1}
                    : e
            )
        );

        try {
            const res = await axiosClient.post(
                        API.AXIOS_CONTEST_ENTRIES_VOTE
                            .replace("{id}", id)
                            .replace("{entryId}", entryId)
                    );
            if(res.data.isSuccess){
                toast.success("Vote success.")
            }

        } catch (err) {
            setEntries((prev) =>
                prev.map((e) =>
                    e.id === entryId
                        ? {...e,
                            isVoted: !e.isVoted,
                            voteCount: e.isVoted
                                ? e.voteCount - 1
                                : e.voteCount + 1}
                        : e
                )
            );
            toast.error("Could not vote. Please try again.");
        }
    };

    const hasSubmitted = useMemo(() => {
        return entriesWithMine.some((e) => e.mine);
    }, [entriesWithMine]);  

    const handleOpenSubmitModal = () => {
        setSelectedVideoId(null);
        setShowSubmitModal(true);
    };

    const handleCloseSubmitModal = () => {
        setShowSubmitModal(false);
        setSelectedVideoId(null);
    };

    const handleSubmitEntry = async (videoId) => {
        if (!videoId) return;
        setSubmitting(true);
        try {
            const res = await axiosClient.post(API.AXIOS_CONTEST_ENTRIES_INSERT.replace("{id}", id), {
                videoId,
            });
            if(res.data.isSuccess){
                toast.success(res.data.message);
                 handleCloseSubmitModal();
                 fetchEntries();
            }
           
        } catch (err) {
            toast.error(
                axios.isAxiosError(err) && err.response
                    ? err.response.data?.message ?? "Something went wrong"
                    : "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const sortedEntries = useMemo(() => {
        return [...entriesWithMine].sort(
            (a, b) => b.voteCount - a.voteCount
        );
    }, [entriesWithMine]);

    const top3 = sortedEntries.slice(0, 3);
    const maxVotes = sortedEntries[0]?.voteCount ?? 0;
    const cfg = CATEGORY_CONFIG_DETAIL[
        contest?.category?.toLowerCase() as keyof typeof CATEGORY_CONFIG_DETAIL
    ];
    const statusKey = contest?.startDate && contest?.endDate
        ? getStatus(contest.startDate, contest.endDate)
        : "active";
    const status = STATUS_CONFIG[statusKey];
    const isEnded = statusKey === "ended";

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10 bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => onBack ? onBack() : navigate({ to: "/contests" })}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-6"
                >
                    <IconContestDetail.ArrowLeft /> Back to contests
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg?.badgeBg} ${cfg?.badgeColor}`}>
                                {cfg?.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badgeBg} ${status.badgeColor}`}>
                                {status.label}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{contest?.title}</h1>
                        <p className="text-sm text-gray-500 mt-1.5 max-w-2xl leading-relaxed">{contest?.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                            <span className="inline-flex items-center gap-1">
                                <IconContestDetail.Calendar /> {DateUtil.formatDate(contest?.startDate)} – {DateUtil.formatDate(contest?.endDate)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <IconContestDetail.Users /> {entriesWithMine?.length} entries
                            </span>
                        </div>
                    </div>

                    {role === StringValue.MEMBER && (
                        <button
                            onClick={handleOpenSubmitModal}
                            disabled={hasSubmitted || isEnded || statusKey === "upcoming"}
                            className={`cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors ${
                                hasSubmitted || isEnded || statusKey === "upcoming"
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {hasSubmitted ? (
                                <><IconContestDetail.Check className="w-4 h-4" /> You've submitted</>
                            ) : isEnded ? (
                                "Contest ended"
                            ) : statusKey === "upcoming" ? (
                                "Not open yet"
                            ) : (
                                "Submit your video"
                            )}
                        </button>
                    )}
                </div>
                {statusKey === "upcoming" && contest?.startDate && (
                    <UpcomingBanner startDate={contest.startDate} endDate={contest.endDate} />
                )}       
                {isEnded && top3.length > 0 && (
                    <WinnerPodium top3={top3} onOpen={setOpenedEntry} />
                )}     
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                    <div>
                        {sortedEntries.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                {sortedEntries.map((entry, i) => (
                                    <ContestVideoCard
                                        key={entry.id}
                                        entry={entry}
                                        rank={i + 1}
                                        onVote={handleVote}
                                        onOpen={setOpenedEntry}
                                        onDelete={setDeletingEntryId}
                                        role={role}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center bg-white">
                                <p className="text-sm font-semibold text-gray-700">No entries yet</p>
                                <p className="text-xs text-gray-400 mt-1">Be the first to submit a video.</p>
                            </div>
                        )}
                    </div>

                    <aside className="lg:sticky lg:top-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <IconContestDetail.Flame className="text-orange-500" />
                                <h2 className="text-sm font-bold text-gray-900">Leading now</h2>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">Top 3 by votes</p>

                            {top3.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {top3.map((entry, i) => (
                                        <LeaderboardRow
                                            key={entry.id}
                                            entry={entry}
                                            rank={i + 1}
                                            maxVotes={maxVotes}
                                            onOpen={setOpenedEntry}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 py-4 text-center">No votes yet</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            <SubmitEntryModal
                open={showSubmitModal}
                onClose={handleCloseSubmitModal}
                myVideos={ownVideos.filter((v) => v.visibility === StringValue.TYPE_VIDEO_PUBLIC)}
                loading={false}
                selectedVideoId={selectedVideoId}
                onSelect={setSelectedVideoId}
                onSubmit={handleSubmitEntry}
                submitting={submitting}
            />
            <VideoExpandModal video={openedEntry} onClose={() => setOpenedEntry(null)} />
            <DeleteConfirmModal
                open={!!deletingEntryId}
                onClose={() => setDeletingEntryId(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </section>
    );
}