import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "@/Store/userStore";
import { StringValue } from "@/lib/stringValue";
import { Icon, getOpportunityCategoryConfig   } from "./opportunityConfig";
import { TextUtil } from "@/lib/textUtil";

const PAGE_SIZE = 6;

function getPageNumbers(current, total, siblingCount = 1) {
  const totalNumbers = siblingCount * 2 + 5;
  if (total <= totalNumbers) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(current - siblingCount, 1);
  const right = Math.min(current + siblingCount, total);
  const pages = [1];
  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) if (p !== 1 && p !== total) pages.push(p);
  if (right < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

const OpportunitySchema = Yup.object({
  title:      Yup.string().trim().required("Title is required").max(150, "Max 150 characters"),
  category:   Yup.string().required("Please choose a category"),
  description:Yup.string().trim().required("Description is required"),
  province_id:Yup.number().required("Please select a province"),
});

export default function Opportunities({role}) {
    const isRecruiter = role === StringValue.RECRUITER;
    const isAdmin     = role === StringValue.ADMIN;
    const canPost     = isRecruiter || isAdmin;

    // data
    const [opportunities, setOpportunities] = useState([]);
    const [provinces, setProvinces]         = useState([]);
    const [options, setOptions]             = useState(null);
    const [isLoading, setIsLoading]         = useState(true);
    const [myOpportunities, setMyOpportunities] = useState([]);

    // filters / UI
    const [searchQuery, setSearchQuery]   = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [provinceFilter, setProvinceFilter] = useState(null);
    const [activeTab, setActiveTab]       = useState("all");
    const [openMenuId, setOpenMenuId]     = useState(null);
    const [selectedOpp, setSelectedOpp]   = useState(null);

    // modals
    const [isFormOpen, setIsFormOpen]     = useState(false);
    const [editingOpp, setEditingOpp]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // pagination
    const [allPage, setAllPage]           = useState(1);
    const [allTotalCount, setAllTotalCount] = useState(0);
    const [allTotalPages, setAllTotalPages] = useState(1);

    const [minePage, setMinePage]           = useState(1);
    const [mineTotalCount, setMineTotalCount] = useState(0);
    const [mineTotalPages, setMineTotalPages] = useState(1);

    const page       = activeTab === "mine" ? minePage       : allPage;
    const setPage    = activeTab === "mine" ? setMinePage    : setAllPage;
    const totalCount = activeTab === "mine" ? mineTotalCount : allTotalCount;
    const totalPages = activeTab === "mine" ? mineTotalPages : allTotalPages;

    const categoryKeys = options?.talentCategories ?? [];

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
            const response = await axios.get(API.PROVINCE_GET_ALL)
            setProvinces(response.data.data)
            } catch (error) {
            console.error("Error fetching provinces:", error)
            }
        }

        fetchProvinces()
        }, [])

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

    const fetchOpportunities = async (p = page) => {
        setIsLoading(true);
        try {
        const res = await axiosClient.get(API.AXIOS_OPPORTUNITIES_GET_ALL, {
            params: {
            page: p,
            pageSize: PAGE_SIZE,
            category:   categoryFilter || undefined,
            provinceId: provinceFilter || undefined,
            tab: activeTab === "mine" ? "mine" : undefined,
            },
        });
        if (res.data.isSuccess) {
            const data = res.data.data;
            const raw  = Array.isArray(data.opportunities) ? data.opportunities : [];
            setOpportunities(raw);
            const total = data.totalCount ?? raw.length;
            setAllTotalCount(total);
            setAllTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
        }
        } catch (e) {
        console.error(e);
        toast.error("Could not load opportunities.");
        } finally {
        setIsLoading(false);
        }
    };
    useEffect(() => { fetchOpportunities(page); }, [page, categoryFilter, provinceFilter, activeTab]);

    const fetchMyOpp = async (p = page)=>{
        setIsLoading(true);
        try {
        const res = await axiosClient.get(API.AXIOS_OPPORTUNITIES_GET_OWN, {
            params: {
            page: p,
            pageSize: PAGE_SIZE,
            },
        });
        if (res.data.isSuccess) {
            const data = res.data.data;
            const raw  = Array.isArray(data.opportunities) ? data.opportunities : [];
            setMyOpportunities(raw);
            const total = data.totalCount ?? raw.length;
            setMineTotalCount(total);
            setMineTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
        }
        } catch (e) {
        console.error(e);
        toast.error("Could not load opportunities.");
        } finally {
        setIsLoading(false);
        }
    }
    useEffect(() => {
        if (canPost) {
            fetchMyOpp(1);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "mine" && canPost) {
            fetchMyOpp(minePage);
        }
    }, [minePage, activeTab]);

    useEffect(() => {
        if (activeTab === "mine") return;
        if (page !== 1) setPage(1);
        else fetchOpportunities(1);
    }, [activeTab, categoryFilter, provinceFilter]);

    const myOppIds = useMemo(
        () => new Set(myOpportunities.map((o) => o.id)),
        [myOpportunities]
    );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
        title:       editingOpp?.title       ?? "",
        category:    editingOpp?.category    ?? "",
        description: editingOpp?.description ?? "",
        province_id: editingOpp?.provinceId  ?? "",
        },
        validationSchema: OpportunitySchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
        const req = {
            Title:       values.title.trim(),
            Category:    values.category,
            Description: values.description.trim(),
            ProvinceId:  Number(values.province_id),
        };
        try {
            const api = editingOpp
            ? axiosClient.put(API.AXIOS_OPPORTUNITIES_UPDATE.replace("{id}", editingOpp.id), { Id: editingOpp.id, ...req })
            : axiosClient.post(API.AXIOS_OPPORTUNITIES_INSERT, req);
            const res = await api;
            if (res.data.isSuccess) {
            toast.success(editingOpp ? "Opportunity updated!" : "Opportunity posted!");
            resetForm();
            setIsFormOpen(false);
            setEditingOpp(null);
            if (page === 1) {
                fetchOpportunities(1);
                fetchMyOpp(1);
            } else {
                setPage(1);
            }
            }
        } catch (e) {
            console.error(e);
            toast.error("Could not save opportunity. Please try again.");
        } finally {
            setSubmitting(false);
        }
        },
    });

    const closeFormModal = () => {
        formik.resetForm();
        setEditingOpp(null);
        setIsFormOpen(false);
    };

    const filtered = useMemo(() => {
        const source = activeTab === "mine" ? myOpportunities : opportunities;
        
        if (!searchQuery.trim()) return source;
        const q = TextUtil.normalizeText(searchQuery);
        return source.filter((o) =>
            TextUtil.normalizeText(o.title).includes(q) ||
            TextUtil.normalizeText(o.description).includes(q) ||
            TextUtil.normalizeText(o.category).includes(q)
        );
    }, [opportunities, myOpportunities, searchQuery, activeTab]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
        const res = await axiosClient.delete(API.AXIOS_OPPORTUNITIES_DELETE.replace("{id}", deleteTarget.id));
        if (res.data.isSuccess) {
            toast.success("Opportunity deleted.");
            setDeleteTarget(null);
            fetchOpportunities(page);
            fetchMyOpp(page);   
        }
        } catch (e) {
        console.error(e);
        toast.error("Delete failed.");
        }
    };

    const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

    const TABS = [
        { id: "all",  label: "All opportunities" },
        ...(canPost ? [{ id: "mine", label: "My posts" }] : []),
    ];

    return (
        <section className="px-6 sm:px-10 lg:px-16 py-10">
        <div className="max-w-7xl mx-auto">

            {/* ── Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
                <p className="text-sm text-gray-500 mt-1">
                Gigs, auditions, and freelance projects matched to your talent.
                </p>
            </div>
            {canPost && (
                <button
                onClick={() => { setEditingOpp(null); formik.resetForm(); setIsFormOpen(true); }}
                className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                <Icon.Plus />
                Post opportunity
                </button>
            )}
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
            <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xl font-extrabold text-gray-900">{totalCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Open roles</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xl font-extrabold text-gray-900">{categoryKeys.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Categories</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xl font-extrabold text-gray-900">{provinces.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Provinces</p>
            </div>
            </div>

            {canPost && (
            <div className="flex items-center gap-1 border border-gray-100 rounded-lg p-1 w-fit mb-5">
                {TABS.map((tab) => (
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
            )}

            {/* ── Search + Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities"
                className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
            </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
            <button
                onClick={() => setCategoryFilter(null)}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                categoryFilter === null ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
            >
                All categories
            </button>
            {categoryKeys.map((key) => {
                const cfg    = getOpportunityCategoryConfig  (key);
                const active = categoryFilter === key;
                return (
                <button
                    key={key}
                    onClick={() => setCategoryFilter(active ? null : key)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    {cfg.emoji} {cfg.label}
                </button>
                );
            })}
            </div>

            {/* Province pills */}
            {provinces.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
                <button
                onClick={() => setProvinceFilter(null)}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    provinceFilter === null ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
                >
                All provinces
                </button>
                {provinces.slice(0, 10).map((prov) => {
                const active = provinceFilter === prov.id;
                return (
                    <button
                    key={prov.id}
                    onClick={() => setProvinceFilter(active ? null : prov.id)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                    >
                    📍 {prov.name}
                    </button>
                );
                })}
            </div>
            )}

            {/* ── Grid ── */}
            {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-5 h-48 animate-pulse bg-gray-50" />
                ))}
            </div>
            ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((opp) => {
                const cfg = getOpportunityCategoryConfig(opp.category);
                return (
                    <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="cursor-pointer border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-gray-200 transition-all"
                    >
                    <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-lg ${cfg.iconBg} flex items-center justify-center text-lg`}>
                        {cfg.emoji}
                        </div>

                        {canPost && myOppIds.has(opp.id) && (
                        <div className="relative">
                            <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === opp.id ? null : opp.id); }}
                            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                            <Icon.MoreVertical />
                            </button>
                            {openMenuId === opp.id && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1"
                            >
                                <button
                                onClick={() => { setEditingOpp(opp); setIsFormOpen(true); setOpenMenuId(null); }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                >
                                Update
                                </button>
                                <button
                                onClick={() => { setDeleteTarget(opp); setOpenMenuId(null); }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                                >
                                Delete
                                </button>
                            </div>
                            )}
                        </div>
                        )}
                    </div>

                    {/* title + badge */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{opp.title}</h3>
                        <span className={`inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                        {cfg.label}
                        </span>
                    </div>

                    {/* description */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{opp.description}</p>

                    {/* meta */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium flex-wrap">
                        {opp.provinceName && (
                        <span className="inline-flex items-center gap-1">
                            <Icon.MapPin /> {opp.provinceName}
                        </span>
                        )}
                    {opp.postedBy && (
                        <span className="inline-flex items-center gap-1">
                            <Icon.Briefcase /> {opp.postedBy.username}
                        </span>
                        )}
                        {opp.createdAt && (
                        <span className="inline-flex items-center gap-1">
                            <Icon.Clock /> {new Date(opp.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        )}
                    </div>
                    </div>
                );
                })}
            </div>
            ) : (
            <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3 text-xl">
                💼
                </div>
                <p className="text-sm font-semibold text-gray-700">
                {activeTab === "mine" ? "You haven't posted any opportunities yet" : "No opportunities found"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                {activeTab === "mine"
                    ? "Post a gig or audition for the community."
                    : "Try a different search, category, or province."}
                </p>
                {activeTab === "mine" && canPost && (
                <button
                    onClick={() => { setEditingOpp(null); formik.resetForm(); setIsFormOpen(true); }}
                    className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                    Post an opportunity
                </button>
                )}
            </div>
            )}

            {/* ── Pagination ── */}
            {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-3 mt-8">
                <p className="text-xs text-gray-400">
                Page {page} of {totalPages} · {totalCount} opportunit{totalCount === 1 ? "y" : "ies"} total
                </p>
                <div className="flex items-center gap-1.5">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Icon.ChevronLeft /> Prev
                </button>
                {pageNumbers.map((p, i) =>
                    p === "…" ? (
                    <span key={`e-${i}`} className="px-1.5 text-xs text-gray-400 select-none">…</span>
                    ) : (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`cursor-pointer w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        page === p ? "bg-blue-600 text-white" : "text-gray-500 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                    )
                )}
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next <Icon.ChevronRight />
                </button>
                </div>
            </div>
            )}
        </div>

        {selectedOpp && (() => {
            const cfg = getOpportunityCategoryConfig  (selectedOpp.category);
            return (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={(e) => { if (e.target === e.currentTarget) setSelectedOpp(null); }}
            >
                <div
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="p-6">
                    {/* header */}
                    <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center text-xl shrink-0`}>
                        {cfg.emoji}
                        </div>
                        <div>
                        <h3 className="text-base font-bold text-gray-900">{selectedOpp.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeColor}`}>
                            {cfg.label}
                            </span>
                            {selectedOpp.provinceName && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                <Icon.MapPin /> {selectedOpp.provinceName}
                            </span>
                            )}
                        </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedOpp(null)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                        <Icon.X />
                    </button>
                    </div>

                    {/* posted by */}
                    {selectedOpp.postedBy && (
                    <p className="text-xs text-gray-400 mt-3">Posted by <span className="font-semibold text-gray-600">{selectedOpp.postedBy.username}</span></p>
                    )}

                    {/* divider */}
                    <div className="border-t border-gray-100 my-4" />

                    {/* description */}
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">About this opportunity</h4>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{selectedOpp.description}</p>

                    {/* footer */}
                    <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        {selectedOpp.createdAt && new Date(selectedOpp.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                    {!isRecruiter && !isAdmin &&(
                        <button
                            onClick={() => {
                            toast.info("Messaging this recruiter — coming soon!");
                            }}
                            className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Contact recruiter <Icon.ExternalLink />
                        </button>
                    )}
                    </div>
                </div>
                </div>
            </div>
            );
        })()}

        {isFormOpen && (
            <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => { if (e.target === e.currentTarget) closeFormModal(); }}
            >
            <div
                className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-bold text-gray-900">
                    {editingOpp ? "Update opportunity" : "Post opportunity"}
                </h3>
                <button onClick={closeFormModal} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                    <Icon.X />
                </button>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                {editingOpp ? "Edit the details below." : "Share a gig, audition call, or freelance project with the community."}
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Category picker */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                    {categoryKeys.map((key) => {
                        const cfg = getOpportunityCategoryConfig  (key);
                        const selected = formik.values.category === key;
                        return (
                        <button
                            type="button"
                            key={key}
                            onClick={() => formik.setFieldValue("category", key)}
                            className={`cursor-pointer rounded-lg border p-2.5 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                            selected ? `${cfg.badgeBg} ${cfg.badgeColor} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <span style={selected ? {} : { filter: "grayscale(1) opacity(0.5)" }}>{cfg.emoji}</span>
                            {cfg.label}
                        </button>
                        );
                    })}
                    </div>
                    {formik.touched.category && formik.errors.category && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                    <input
                    name="title"
                    type="text"
                    placeholder="e.g. Freelance Guitarist for Wedding Season"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                    )}
                </div>

                {/* Province */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Province</label>
                    <select
                    name="province_id"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.province_id}
                    >
                    <option value="">Select a province</option>
                    {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    </select>
                    {formik.touched.province_id && formik.errors.province_id && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.province_id}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                    name="description"
                    placeholder="Describe the opportunity, requirements, pay, and how to apply…"
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    />
                    {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                    <button
                    type="button"
                    onClick={closeFormModal}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {formik.isSubmitting
                        ? (editingOpp ? "Updating…" : "Posting…")
                        : (editingOpp ? "Update opportunity" : "Post opportunity")}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        {deleteTarget && (
            <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setDeleteTarget(null)}
            >
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900">Delete opportunity?</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">{deleteTarget.title}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
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
