import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";
import { useUserStore } from "@/Store/userStore";
import { CATEGORY_CONFIG, Icon } from "./mentorConfig";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";

const SKILL_BADGE = {
    Beginner: "bg-gray-100 text-gray-600",
    Intermediate: "bg-sky-50 text-sky-700",
    Advanced: "bg-violet-50 text-violet-700",
};

const ACHIEVEMENT_TYPE_ICON = {
    achievement: "🏅",
    award: "🏆",
    certification: "📜",
};


export default function MentorProfile({ id }) {
   

    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const [mentor, setMentor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [menteeCount, setMenteeCount] = useState(0);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageDraft, setMessageDraft] = useState("");
    const [messageSent, setMessageSent] = useState(false);
    const cfg = CATEGORY_CONFIG[mentor?.primaryCategory?.toLowerCase()];

    useEffect(() => {
        if (!id) return;
        let active = true;

        const fetchMentor = async () => {
            try {
                setIsLoading(true);
                const res = await axiosClient.get(API.AXIOS_USER_GET_BY_ID.replace("{id}", id));
                if (active && res.data.isSuccess) {
                    setMentor(res.data.data);
                    setMenteeCount(res.data.data?.followerCount ?? 0);
                    setFollowing(res.data.data?.isFollowing ?? false);
                }
            } catch {
                toast.error("Unable to load mentor profile");
            } finally {
                if (active) setIsLoading(false);
            }
        };

        fetchMentor();
        return () => { active = false; };
    }, [id]);

    const toggleFollow = async () => {
        if (!userInfo) {
            toast.info("Log in to follow mentors");
            navigate({ to: "/login", search: { redirect: location.href } });
            return;
        }
        if (isTogglingFollow) return;
        setIsTogglingFollow(true);
        try {
            const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", id));
            if (res.data.isSuccess) {
                // Only update state AFTER the server confirms.
                setMenteeCount((c) => c + (following ? -1 : 1));
                setFollowing((f) => !f);
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "Something went wrong"
                    : "Something went wrong"
            );
        } finally {
            setIsTogglingFollow(false);
        }
    };

    const sendMessage = async () => {
        if (!messageDraft.trim()) return;
        try {
            const res = await axiosClient.post(API.AXIOS_MESSAGE_INSERT, {
                ReceiverId: id,
                Content: messageDraft.trim(),
            });
            if (res.data.isSuccess) {
                setMessageSent(true);
                setMessageDraft("");
                setTimeout(() => {
                    setMessageOpen(false);
                    setMessageSent(false);
                }, 1200);
            } else {
                toast.error(res.data.message || "Failed to send message");
            }
        } catch {
            toast.error("Failed to send message");
        }
    };
    
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate({ to: "/mentors" })}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors mb-6"
                >
                    <Icon.ArrowLeft /> Back to mentors
                </button>

                {/* Profile card */}
                <div className="border border-gray-100 rounded-2xl p-6 mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4">
                            <UserAvatar
                                profileImageUrl={mentor?.profileImageUrl}
                                firstName={mentor?.firstName}
                                lastName={mentor?.lastName}
                                username={mentor?.username}
                                size={64}
                                className="border border-gray-100"
                            />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">
                                    {mentor?.firstName} {mentor?.lastName}
                                </h1>
                                <p className="text-xs text-gray-400 mb-2">@{mentor?.username}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg?.badgeBg} ${cfg?.badgeColor}`}>
                                        {cfg?.icon} {cfg?.label}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SKILL_BADGE[mentor?.skillLevel] ?? "bg-gray-100 text-gray-600"}`}>
                                        {mentor?.skillLevel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium flex-wrap">
                                    <span className="inline-flex items-center gap-1">
                                        <Icon.MapPin /> {mentor?.provinceName}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Icon.Users /> {menteeCount} followers
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMessageOpen(true)}
                                className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Icon.MessageSquare /> Message
                            </button>
                            <button
                                onClick={toggleFollow}
                                disabled={isTogglingFollow}
                                className={`cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 ${
                                    following
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                <Icon.UserPlus /> {following ? "Following" : "Follow"}
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {mentor?.bio && (
                        <p className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500 leading-relaxed">
                            {mentor?.bio}
                        </p>
                    )}
                    {!mentor?.bio && (
                        <p className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-400 italic">
                            This mentor hasn't added a bio yet.
                        </p>
                    )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="border border-gray-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-gray-900">{menteeCount}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Followers</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-gray-900">{mentor?.followingCount ?? 0}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Following</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                        <p className="text-2xl font-extrabold text-gray-900">{(mentor?.achievements ?? []).length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Credentials</p>
                    </div>
                </div>

                {/* Credentials */}
                <div className="border border-gray-100 rounded-xl p-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Credentials</h3>
                    {(mentor?.achievements ?? []).length > 0 ? (
                        <div className="space-y-3">
                            {mentor?.achievements.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-lg leading-none">{ACHIEVEMENT_TYPE_ICON[a.type] ?? "🏅"}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                                        <p className="text-xs text-gray-400">{a.issuer} · {a.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No credentials listed yet.</p>
                    )}
                </div>
            </div>

            {/* Message modal */}
            {messageOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                    onClick={() => setMessageOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-sm w-full p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-900">
                                Message {mentor?.firstName} {mentor?.lastName}
                            </h3>
                            <button
                                onClick={() => setMessageOpen(false)}
                                className="cursor-pointer text-gray-300 hover:text-gray-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        {messageSent ? (
                            <p className="text-sm text-emerald-600 font-medium py-4 text-center">Message sent!</p>
                        ) : (
                            <>
                                <textarea
                                    value={messageDraft}
                                    onChange={(e) => setMessageDraft(e.target.value)}
                                    placeholder="Say hi and share what you'd like feedback on..."
                                    rows={4}
                                    className="w-full text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!messageDraft.trim()}
                                    className="cursor-pointer mt-3 w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon.Send /> Send message
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
