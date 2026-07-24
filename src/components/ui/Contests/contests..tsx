import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import axios from "axios";
import { getSingleCategoryConfig, STATUS_CONFIG, getStatus, daysLeft, Icon } from "./contestCategoryConfig";
import { toast } from "react-toastify";
import DateUtil from "@/lib/dateUtil";
import { useUserStore } from "@/Store/userStore";
import { StringValue } from "@/lib/stringValue";

const PAGE_SIZE = 6;

function getPageNumbers(current, total, siblingCount = 1) {
    const totalNumbers = siblingCount * 2 + 5;
    if (total <= totalNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, total);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    const pages = [1];
    if (showLeftEllipsis) pages.push("…");
    for (let p = leftSibling; p <= rightSibling; p++) {
        if (p !== 1 && p !== total) pages.push(p);
    }
    if (showRightEllipsis) pages.push("…");
    pages.push(total);

    return pages;
}

const CreateContestSchema = Yup.object({
    title: Yup.string().trim().required("This field is required").max(100, "Title must be at most 100 characters"),
    category: Yup.string().required("This field is required"),
    description: Yup.string().max(200, "Description must be at most 200 characters"),
    startDate: Yup.string().required("This field is required"),
    endDate: Yup.string()
        .required("This field is required")
        .test("after-start", "End date must be after start date", function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return true;
            return new Date(value) >= new Date(startDate);
        }),
});


export default function Contests() {
    const {userInfo} = useUserStore();
    const role = userInfo?.role;
    const navigate = useNavigate();
    const [options, setOptions] = useState();
    const [contests, setContests] = useState([]);
    const [isLoadingContests, setIsLoadingContests] = useState(true);
    const [activeTab, setActiveTab] = useState("discover");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingContest, setEditingContest] = useState(null);
    const [myEntries, setMyEntries] = useState([]);

    // ---- Pagination state ----
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const categoryKeys = options?.talentCategories ?? [];

    const TAPS = [
        { id: "discover", label: "Discover" },
        { id: "mine", label: "My entries" },
    ].filter((tab) => {
        if (tab.id === "mine" && role === StringValue.RECRUITER) {
            return false;
        }
        return true;
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(API.OPTION_GET_ALL);
                setOptions(response.data.data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
        fetchOptions();
    }, []);

    const fetchContests = async (pageToFetch = page) => {
        setIsLoadingContests(true);
        try {
            const res = await axiosClient.get(API.AXIOS_CONTEST_GET_ALL, {
                params: {
                    page: pageToFetch,
                    pageSize: PAGE_SIZE,
                    category: categoryFilter || undefined,
                    tab: activeTab === "mine" ? "mine" : undefined
                },
            });
            if (res.data.isSuccess) {
                const data = res.data.data;
                const raw = Array.isArray(data.contests)
                    ? data.contests
                    : [];
                setContests(raw);
                const total =
                    data.totalCount ??
                    data.TotalCount ??
                    raw.length;
                setTotalCount(total);
                setTotalPages(
                    Math.max(1, Math.ceil(total / PAGE_SIZE))
                );
            }
        } catch(error) {
            console.error(error);
            toast.error("Could not load contests.");
        }
        finally {
            setIsLoadingContests(false);
        }
    };
    console.log("check contest: ", myEntries)
    useEffect(() => {
        fetchContests(page);
    }, [
        page,
        categoryFilter,
        activeTab
    ]);

    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        } else {
            fetchContests(1);
        }
    }, [activeTab, categoryFilter]);

    const fetchMyEntries = async () => {
        if (!userInfo) return;
        try {
            const res = await axiosClient.get(API.AXIOS_CONTEST_ENTRIES_GET_OWN);
            if(res.data.isSuccess){
                setMyEntries(res?.data.data.entries ?? []);
            };
        } catch (error) {
            console.error("Error fetching my entries:", error);
        }
    }
    useEffect(()=>{
        fetchMyEntries();
    },[userInfo]);


    const selected = useMemo(() => contests?.find((c) => c.id === selectedId) ?? null, [contests, selectedId]);

    const formik = useFormik({
        enableReinitialize:true,
        initialValues:{
            title: editingContest?.title ?? "",
            category: editingContest?.category ?? "",
            description: editingContest?.description ?? "",
            startDate: editingContest?.startDate?.substring(0,10) ?? "",
            endDate: editingContest?.endDate?.substring(0,10) ?? "",
        },
        validationSchema: CreateContestSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const req = {
                Title: values.title.trim(),
                Category: values.category,
                Description: values.description.trim(),
                StartDate: new Date(values.startDate).toISOString(),
                EndDate: new Date(values.endDate).toISOString(),
            };
            try {
                const api = editingContest ? axiosClient.put(
                        API.AXIOS_CONTEST_UPDATE.replace(
                            "{id}",
                            editingContest.id
                        ),
                        {
                            Id: editingContest.id,
                            ...req
                        }
                    )
                    : axiosClient.post(
                        API.AXIOS_CONTEST_INSERT,
                        req
                    );

                const res = await api;
                if (res.data.isSuccess) {
                    toast.success(
                        editingContest
                            ? "Contest updated!"
                            : "Contest created!"
                    );
                    resetForm();
                    setIsCreateOpen(false);
                    if (page === 1) {
                        fetchContests(1);
                    } else {
                        setPage(1);
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Error creating contest:", error.response.data);
                } else {
                    console.error("Error with no response:", error);
                }
                toast.error("Could not create contest. Please try again.");
            } finally {
                setSubmitting(false);
            }
        },
    });

   const closeCreateModal = () => {
        formik.resetForm();
        setEditingContest(null);
        setIsCreateOpen(false);
    };

    const enriched = useMemo(
        () =>
            contests.map((c) => ({
                ...c,
                status: getStatus(c.startDate, c.endDate),
            })),
        [contests]
    );

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return enriched;
        const q = searchQuery.toLowerCase().trim();
        return enriched.filter((c) =>
            c.title?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q)
        );
    }, [enriched, searchQuery]);

    const filteredEntries = useMemo(() => {
        let result = myEntries;
        if (categoryFilter) {
            result = result.filter((e) => e.contestCategory === categoryFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (e) =>
                    e.videoTitle?.toLowerCase().includes(q) ||
                    e.contestTitle?.toLowerCase().includes(q) ||
                    e.contestCategory?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [myEntries, categoryFilter, searchQuery]);

    const activeCount = enriched.filter((c) => c.status === "active").length;

    const openDetail = (id) => {
        navigate({ to: "/contestDetail", search: { id } });
    };
    const closeDetail = () => setSelectedId(null);
    const sortedEntries = useMemo(() => {
        if (!selected) return [];
        return [...selected.entries].sort((a, b) => b.votes - a.votes);
    }, [selected]);
    const selectedCfg = selected ? getSingleCategoryConfig(selected.category) : null;
    const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

    const handleDeleteContest = async(contest)=>{
        const start = new Date(contest.startDate);
        const now = new Date();
        if(now >= start){
            toast.error(
                "Cannot delete contest after it has started."
            );
            return;
        }
        setDeleteTarget(contest);
    };

    const confirmDeleteContest = async()=>{
        if(!deleteTarget) return;
        try {

            const res = await axiosClient.delete(API.AXIOS_CONTEST_DELETE.replace("{id}", deleteTarget.id))
            if(res.data.isSuccess){
                toast.success("Contest deleted!");
                setDeleteTarget(null);
                fetchContests(page);
            }
        }catch(error){
            console.error(error);
            toast.error(
                "Delete failed"
            );
        }
    };

    const handleUpdateContest = (contest)=>{
        const status = getStatus(
            contest.startDate,
            contest.endDate
        );
        if(status !== "upcoming"){
            toast.error(
                "Cannot update contest after it starts."
            );
            return;
        }
        setEditingContest(contest);
        setIsCreateOpen(true);
    };


    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contests</h1>
                        <p className="text-sm text-gray-500 mt-1">Enter a challenge, vote for your favorites, get discovered.</p>
                    </div>
                    {role === StringValue.ADMIN && (
                        <button
                            onClick={() => {
                                setEditingContest(null);
                                formik.resetForm();
                                setIsCreateOpen(true);
                            }}
                            className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            <Icon.Plus />
                            Create contest
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                    <div className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xl font-extrabold text-gray-900">{activeCount}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Voting open</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                        <p className="text-xl font-extrabold text-gray-900">{myEntries.length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">My entries</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border border-gray-100 rounded-lg p-1 w-fit mb-5">
                    {TAPS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                                activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon.Search />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search contests"
                            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setCategoryFilter(null)}
                            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                categoryFilter === null ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            All
                        </button>
                        {categoryKeys.map((key) => {
                            const cfg = getSingleCategoryConfig(key);
                            const active = categoryFilter === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setCategoryFilter(active ? null : key)}
                                    className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                        active ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

               {/* Contest grid */}
                {activeTab === "mine" ? (
                    filteredEntries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredEntries.map((entry) => {
                                const cfg = getSingleCategoryConfig(entry.contestCategory);
                                const status = getStatus(entry.contestStartDate, entry.contestEndDate);
                                const st = STATUS_CONFIG[status];
                                return (
                                    <div
                                        key={entry.entryId}
                                        className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        {/* Thumbnail + video on hover */}
                                        <div
                                            className="w-full aspect-video rounded-xl bg-gray-100 overflow-hidden relative group/thumb cursor-pointer"
                                        >
                                            <video
                                                src={`${API.URL}${entry.videoUrl}`}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                onMouseEnter={(e) => e.currentTarget.play()}
                                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                            />
                                        </div>

                                        {/* Titles */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {entry.videoTitle}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                    {entry.contestTitle}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigate({ to: "/contestDetail", search: { id: entry.contestId } })}
                                                className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                            >
                                                <Icon.ChevronRight />
                                                Go to contest
                                            </button>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                                                {cfg.label}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.badgeBg} ${st.badgeColor}`}>
                                                {st.label}
                                            </span>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                                            <span className="inline-flex items-center gap-1">
                                                <Icon.Calendar />
                                                {DateUtil.formatDate(entry.contestStartDate)} – {DateUtil.formatDate(entry.contestEndDate)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                                                <Icon.ChevronUp />
                                                {entry.voteCount} vote{entry.voteCount !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <Icon.Trophy className="text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">
                                {searchQuery || categoryFilter ? "No entries match your search" : "You haven't entered any contests yet"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {searchQuery || categoryFilter ? "Try a different search or category." : "Discover a contest and submit one of your videos."}
                            </p>
                            <button
                                onClick={() => setActiveTab("discover")}
                                className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                            >
                                Discover contests
                            </button>
                        </div>
                    )
                ) : isLoadingContests ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div 
                            key={i} 
                            className="border border-gray-100 rounded-2xl p-5 h-44 animate-pulse bg-gray-50" />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((c) => {
                            const cfg = getSingleCategoryConfig(c.category);
                            const st = STATUS_CONFIG[c.status];
                            const left = daysLeft(c.endDate);
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => openDetail(c.id)}
                                    className={`cursor-pointer border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all ${c.status === "ended" ? "opacity-50" : ""}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.status === "ended" ? "bg-gray-100 grayscale" : cfg.iconBg}`}>
                                            {cfg.icon}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${st.badgeBg} ${st.badgeColor}`}>
                                                {st.label}
                                            </span>
                                            {role === StringValue.ADMIN && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === c.id ? null : c.id);
                                                        }}
                                                        className="p-1 rounded-md text-gray-400 hover:bg-gray-100"
                                                    >
                                                        <Icon.MoreVertical />
                                                    </button>
                                                    {openMenuId === c.id && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1"
                                                        >
                                                            <button
                                                                onClick={() => { handleUpdateContest(c); setOpenMenuId(null); }}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => { handleDeleteContest(c); setOpenMenuId(null); }}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
                                        <span className={`inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            c.status === "ended" ? "bg-gray-100 text-gray-500" : `${cfg.badgeBg} ${cfg.badgeColor}`
                                        }`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{c.description}</p>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                                        <span className="inline-flex items-center gap-1">
                                            <Icon.Calendar /> {DateUtil.formatDate(c.startDate)} – {DateUtil.formatDate(c.endDate)}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Icon.Users /> entries
                                        </span>
                                    </div>

                                    <div className="mt-1 text-xs font-semibold">
                                        {c.status === "active" && (
                                            <span className="text-emerald-600">
                                                {left === 0 ? "Ends today" : `${left} day${left === 1 ? "" : "s"} left to vote`}
                                            </span>
                                        )}
                                        {c.status === "upcoming" && <span className="text-gray-400">Opens {DateUtil.formatDate(c.startDate)}</span>}
                                        {c.status === "ended" && <span className="text-gray-400">Contest ended</span>}
                                        {c.hasMyEntry && <span className="text-blue-600 ml-2">· You entered</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                            <Icon.Trophy className="text-blue-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">No contests found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search or category.</p>
                    </div>
                )}

                {/* ---------------- Pagination controls ---------------- */}
                {!isLoadingContests && totalPages > 1 && (
                    <div className="flex items-center justify-between flex-wrap gap-3 mt-8">
                        <p className="text-xs text-gray-400">
                            Page {page} of {totalPages} · {totalCount} contest{totalCount === 1 ? "" : "s"} total
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                aria-label="Previous page"
                                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Icon.ChevronLeft />
                                Prev
                            </button>

                            {pageNumbers.map((p, i) =>
                                p === "…" ? (
                                    <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-gray-400 select-none">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        aria-current={page === p ? "page" : undefined}
                                        className={`cursor-pointer w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                                            page === p
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-500 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                aria-label="Next page"
                                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <Icon.ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isCreateOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal(); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-base font-bold text-gray-900">{
                                editingContest
                                ? "Update contest"
                                : "Create contest"
                                }</h3>
                            <button onClick={closeCreateModal} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                <Icon.X />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">Set a challenge and let the community submit and vote.</p>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                {categoryKeys.map((key) => {
                                    const cfg = getSingleCategoryConfig(key);
                                    const selectedCat = formik.values.category === key;
                                    return (
                                        <button
                                            type="button"
                                            key={key}
                                            onClick={() => formik.setFieldValue("category", key)}
                                            className={`cursor-pointer rounded-lg border p-2.5 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                                                selectedCat ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span style={selectedCat ? {} : { filter: "grayscale(1) opacity(0.6)" }}>{cfg.icon}</span>
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {formik.touched.category && formik.errors.category && (
                                <p className="text-red-500 text-xs -mt-2">{formik.errors.category}</p>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contest title</label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="e.g. 60-Second Solo Vocal Challenge"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title}
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="What should people submit? What are the rules?"
                                    rows={3}
                                    maxLength={200}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                />
                                <div className="flex items-center justify-between mt-1.5">
                                    {formik.touched.description && formik.errors.description ? (
                                        <p className="text-red-500 text-xs">{formik.errors.description}</p>
                                    ) : (
                                        <span />
                                    )}
                                    <p className="text-xs text-gray-400 ml-auto">{formik.values.description.length}/200</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start date</label>
                                    <input
                                        name="startDate"
                                        type="date"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.startDate}
                                    />
                                    {formik.touched.startDate && formik.errors.startDate && (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.startDate}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">End date</label>
                                    <input
                                        name="endDate"
                                        type="date"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.endDate}
                                    />
                                    {formik.touched.endDate && formik.errors.endDate && (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.endDate}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {
                                        formik.isSubmitting
                                        ?
                                        (editingContest ? "Updating..." : "Creating...")
                                        :
                                        (editingContest ? "Update contest" : "Create contest")
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selected && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 pb-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-xl ${selectedCfg.iconBg} flex items-center justify-center`}>
                                        {selectedCfg.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">{selected.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedCfg.badgeBg} ${selectedCfg.badgeColor}`}>
                                                {selectedCfg.label}
                                            </span>
                                            {(() => {
                                                const st = STATUS_CONFIG[getStatus(selected.startDate, selected.endDate)];
                                                return (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.badgeBg} ${st.badgeColor}`}>
                                                        {st.label}
                                                    </span>
                                                );
                                            })()}
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <Icon.Calendar /> {DateUtil.formatDate(selected.startDate)} – {DateUtil.formatDate(selected.endDate)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1.5">Hosted by {selected.createdBy}</p>
                                    </div>
                                </div>
                                <button onClick={closeDetail} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                    <Icon.X />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{selected.description}</p>

                            <div className="flex items-center justify-between mt-5 pb-5 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900">
                                    Entries <span className="text-gray-400 font-medium">({selected.entries.length})</span>
                                </p>
                                {getStatus(selected.startDate, selected.endDate) === "active" &&
                                    (enriched.find((c) => c.id === selected.id)?.hasMyEntry ? (
                                        <span className="text-xs font-semibold text-blue-600">You've already entered</span>
                                    ) : (
                                        <button
                                            onClick={() => setIsSubmitOpen(true)}
                                            className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Icon.Plus /> Submit entry
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="p-6 pt-5 space-y-3">
                            {sortedEntries.length > 0 ? (
                                sortedEntries.map((entry, i) => (
                                    <div key={entry.id} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                                        <div className="flex-shrink-0 w-6 text-center">
                                            {i === 0 ? (
                                                <Icon.Crown className="text-amber-500 mx-auto" />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-300">#{i + 1}</span>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Icon.Play />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{entry.videoTitle}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {entry.mine ? "Your entry" : entry.author}
                                            </p>
                                        </div>

                                        <button
                                            // onClick={() => toggleVote(selected.id, entry.id)}
                                            disabled={entry.mine}
                                            className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg border font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                entry.votedByMe
                                                    ? "bg-blue-600 border-blue-600 text-white"
                                                    : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                                            }`}
                                            aria-label={entry.votedByMe ? "Remove vote" : "Vote"}
                                        >
                                            <Icon.ChevronUp />
                                            <span className="text-xs">{entry.votes}</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6 text-gray-500 border border-dashed rounded-xl text-sm">
                                    No entries yet. Be the first to submit.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* {isSubmitOpen && selected && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsSubmitOpen(false); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-base font-bold text-gray-900">Submit entry</h3>
                            <button onClick={() => setIsSubmitOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                                <Icon.X />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">Pick one of your {selectedCfg.label.toLowerCase()} videos for "{selected.title}".</p>

                        {eligibleVideos.length > 0 ? (
                            <div className="space-y-2">
                                {eligibleVideos.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setPickedVideoId(v.id)}
                                        className={`cursor-pointer w-full text-left rounded-lg border px-3 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors ${
                                            pickedVideoId === v.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon.Play className="text-gray-400 flex-shrink-0" />
                                        {v.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-6 text-gray-500 border border-dashed rounded-xl text-sm">
                                You don't have any {selectedCfg.label.toLowerCase()} videos yet. Upload one from My Videos first.
                            </div>
                        )}

                        <div className="flex justify-end gap-2.5 pt-5 mt-5 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsSubmitOpen(false)}
                                className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                // onClick={submitEntry}
                                disabled={!pickedVideoId}
                                className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit entry
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {deleteTarget && (
                <div
                    className="
                        fixed inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        p-4
                        z-50
                    "
                    onClick={() => setDeleteTarget(null)}>
                    <div
                        className="
                            bg-white
                            rounded-2xl
                            w-full
                            max-w-sm
                            p-6
                            shadow-xl
                        "
                        onClick={(e)=>e.stopPropagation()}
                    >
                        <h3 className="
                            text-base
                            font-bold
                            text-gray-900
                        ">
                            Delete contest?
                        </h3>
                        <p className="
                            text-sm
                            text-gray-500
                            mt-2
                            leading-relaxed
                        ">
                            Are you sure you want to delete
                            <span className="font-semibold text-gray-800">
                                {" "}{deleteTarget.title}
                            </span>
                            ?

                            This action cannot be undone.
                        </p>

                        <div className="
                            flex
                            justify-end
                            gap-3
                            mt-6
                        ">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="
                                    px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    border
                                    border-gray-200
                                    text-gray-600
                                    hover:bg-gray-50
                                "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteContest}
                                className="
                                    px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    bg-red-600
                                    text-white
                                    hover:bg-red-700
                                "
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                )}
        </section>
    );
}
