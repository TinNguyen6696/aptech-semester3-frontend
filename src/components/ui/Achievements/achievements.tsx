import { useEffect, useMemo, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { API } from "@/lib/apiendpoint";
import { StringValue } from "@/lib/stringValue";
import axiosClient from "@/services/axiosClient";
import { toast } from "react-toastify";
import DateUtil from "@/lib/dateUtil";
import type { AchievementTypeConfig, Achievement, AchievementFormValues } from "@/types/achievement.types";

export default function Achievements() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeOptions, setTypeOptions] = useState<AchievementTypeConfig[]>([]);
    const [rawAchievementsData, setRawAchievementsData] = useState<Achievement[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editTarget, setEditTarget] = useState<Achievement | null>(null);

    const mapTypeAchievement = (achievementTypes: string[]): AchievementTypeConfig[] => {
        const configAchievementType: AchievementTypeConfig[] = [];
        achievementTypes.forEach((item) => {
            switch (item) {
                case StringValue.ACHIEVEMENT: {
                    configAchievementType.push({
                        label: StringValue.ACHIEVEMENT,
                        badgeBg: "bg-amber-100",
                        badgeColor: "text-amber-700",
                        iconBg: "bg-amber-100",
                        iconColor: "#B45309",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/>
                                <path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"/>
                            </svg>
                        ),
                    });
                    break;
                }
                case StringValue.CERTIFICATION: {
                    configAchievementType.push({
                        label: StringValue.CERTIFICATION,
                        badgeBg: "bg-blue-100",
                        badgeColor: "text-blue-700",
                        iconBg: "bg-blue-100",
                        iconColor: "#1D4ED8",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="14" rx="2"/>
                                <path d="M8 21h8M12 17v4"/>
                            </svg>
                        ),
                    });
                    break;
                }
                default: {
                    configAchievementType.push({
                        label: StringValue.AWARD,
                        badgeBg: "bg-purple-100",
                        badgeColor: "text-purple-700",
                        iconBg: "bg-purple-100",
                        iconColor: "#7C3AED",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/>
                            </svg>
                        ),
                    });
                }
            }
        });
        return configAchievementType;
    };
    const mapUiAchievement = useMemo(() => {
        return rawAchievementsData.map((item) => {
            switch(item.type){
                case StringValue.ACHIEVEMENT:
                    return {
                        ...item,
                        formattedDate:DateUtil.formatMonthDayYear(item?.issuedDate),
                        badgeBg: "bg-amber-100",
                        badgeColor: "text-amber-700",
                        iconBg: "bg-amber-100",
                        iconColor: "#B45309",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/>
                                <path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"/>
                            </svg>
                        ),
                    };
                case StringValue.CERTIFICATION:
                    return{
                        ...item,
                        formattedDate:DateUtil.formatMonthDayYear(item?.issuedDate),
                        badgeBg: "bg-blue-100",
                        badgeColor: "text-blue-700",
                        iconBg: "bg-blue-100",
                        iconColor: "#1D4ED8",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="14" rx="2"/>
                                <path d="M8 21h8M12 17v4"/>
                            </svg>
                        ),
                    };
                default:
                    return {
                        ...item,
                        formattedDate:DateUtil.formatMonthDayYear(item?.issuedDate),
                        badgeBg: "bg-purple-100",
                        badgeColor: "text-purple-700",
                        iconBg: "bg-purple-100",
                        iconColor: "#7C3AED",
                        icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/>
                            </svg>
                        ),
                    };
            }        
        });
    }, [rawAchievementsData]);

    const fetchRawAchievementData = async () => {
        try {
            const res = await axiosClient.get(API.AXIOS_ACHIEVEMENT_GET_ALL);
            setRawAchievementsData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
        }
    };

    useEffect(() => {
        fetchRawAchievementData();
    }, []);
    useEffect(() => {

        const fetchOptions = async () => {
            try {
                const response = await axios.get(API.OPTION_GET_ALL);
                const achievementTypes: string[] = response.data.data?.achievementTypes ?? response.data.data ?? [];
                setTypeOptions(mapTypeAchievement(achievementTypes));
            } catch (error) {
                console.error("Failed to fetch options:", error);
            }
        };
        fetchOptions();
    }, []);
    const achievementSchema = useMemo(() => {
        const validTypes = typeOptions.map((opt) => opt.label);      
        return Yup.object({
            type: Yup.string().oneOf(validTypes, "Please select a type").required("Please select a type"),
            title: Yup.string().trim().required("Title is required").max(120, "Keep it under 120 characters"),
            issuer: Yup.string().trim().required("Organization is required").max(80, "Keep it under 80 characters"),
            issuedDate: Yup.string().required("Date is required"),
            description: Yup.string().required("Description is required").trim().max(200, "Keep it under 200 characters"),
            certUrl: Yup.string().trim().url("Enter a valid URL").nullable().notRequired(),
        }); 
    }, [typeOptions]);
    const formik = useFormik<AchievementFormValues>({
        enableReinitialize: true,
        initialValues: {
            type: editTarget?.type ?? "",
            title: editTarget?.title ?? "",
            issuer: editTarget?.issuer ?? "",
            issuedDate: editTarget?.issuedDate ? editTarget.issuedDate.slice(0, 10) : "",
            description: editTarget?.description ?? "",
            certUrl: editTarget?.certUrl ?? "",
            certificateImage: null,
        },
        validationSchema: achievementSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("Type", values.type || "");
            formData.append("Title", values.title || "");
            if (values.issuer) formData.append("Issuer", values.issuer);
            if (values.issuedDate) {
                formData.append("IssuedDate", new Date(values.issuedDate).toISOString());
            }
            if (values.description) formData.append("Description", values.description);

            if (values.certificateImage) {
                formData.append("CertificateImage", values.certificateImage);
            }

            console.log("check formData:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }   
            try {
                const res = editTarget
                ? await axiosClient.put(API.AXIOS_ACHIEVEMENT_UPDATE.replace("{id}", editTarget.id), formData)
                : await axiosClient.post(API.AXIOS_ACHIEVEMENT_INSERT, formData);

                if(res.data.isSuccess){
                    toast.success(res.data.message);
                    await fetchRawAchievementData();
                    setIsModalOpen(false);
                    formik.resetForm();
                }else{
                    toast.error(res.data.message);
                }                          
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const serverData = error.response.data;
                    toast.error(serverData.message || "Something went wrong");
                } else {
                    console.log("No response received:", error);
                }
            } finally {
                // setIsModalOpen(false);
                // formik.resetForm();
            }
        },
    });

    const openAddModal = () => {
        setEditTarget(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Achievement) => {
        setEditTarget(item);
        setIsModalOpen(true);
    };

    function closeModal() {
        setIsModalOpen(false);
        setEditTarget(null);
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const res = await axiosClient.delete(API.AXIOS_ACHIEVEMENT_DELETE.replace("{id}",deleteTarget.id));
            if (res.data.isSuccess) {
                toast.success(res.data.message ?? "Achievement deleted");
                await fetchRawAchievementData();
                setDeleteTarget(null);
            } else {
                toast.error(res.data.message ?? "Failed to delete achievement");
            }
        } catch (error) {
            toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Something went wrong" : "Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    const certificatePreviewUrl = useMemo(() => {
        if (formik.values.certificateImage) {
            return URL.createObjectURL(formik.values.certificateImage);
        }
        return null;
    }, [formik.values.certificateImage]);

    useEffect(() => {
        return () => {
            if (certificatePreviewUrl) {
                URL.revokeObjectURL(certificatePreviewUrl);
            }
        };
    }, [certificatePreviewUrl]);
    
    return (
        <div className="max-w-3xl mx-auto mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-10 py-10">
            {/* Header */}
            <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
                <p className="text-sm text-gray-500 mt-0.5">Contests, certifications, awards and more</p>
            </div>

            {/* List */}
            <div className="space-y-4 custom-scrollbar overflow-y-auto pr-1" style={{ maxHeight: "420px" }}>
                {mapUiAchievement.length >0 ?
                    (
                        mapUiAchievement.map((item, index) => (
                            <div key={index} className="border border-gray-100 rounded-xl p-4 flex gap-4">
                               
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                                    {item.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.badgeBg} ${item.badgeColor}`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{item.issuer} {item.formattedDate}</p>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                                </div>
                            
                                <div className="flex-shrink-0 flex items-start gap-4 text-sm font-semibold">
                                    {item.hasCertificate && (
                                        <button className="cursor-pointer flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                <path d="M15 3h6v6"/><path d="M10 14 21 3"/>
                                            </svg>
                                            Certificate
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => openEditModal(item)}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                                        className="cursor-pointer text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Delete achievement"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                            <path d="M10 11v6M14 11v6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-6 text-gray-500 border border-dashed rounded-xl">
                            <p>No achievements yet.</p>
                        </div>
                    )}  
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-end">
                <button 
                    onClick={openAddModal}
                    disabled={typeOptions.length === 0}
                    className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add achievement
                </button>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-base font-bold text-gray-900">Add achievement</h3>
                            <button
                                onClick={closeModal}
                                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Add a contest win, certification, award or other achievement.
                        </p>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                {typeOptions.map((item) => {
                                    const selected = formik.values.type === item.label;
                                    return (
                                        <button
                                            type="button"
                                            key={item.label}
                                            onClick={() => formik.setFieldValue("type", item.label)}
                                            className={`cursor-pointer rounded-lg border p-2.5 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                                                selected
                                                    ? `${item.badgeBg} ${item.badgeColor} border-transparent`
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="[&_svg]:w-4 [&_svg]:h-4" style={selected ? {} : { filter: "grayscale(1) opacity(0.6)" }}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </button>
                                    );
                                })}
                                {formik.touched.type && formik.errors.type && (
                                        <p className="text-red-500 text-xs">{formik.errors.type}</p>
                                    )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g. First Place — 60-Second Solo"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-red-500 text-xs">{formik.errors.title}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization</label>
                                    <input
                                        type="text"
                                        name="issuer"
                                        value={formik.values.issuer}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="e.g. AWS"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                    {formik.touched.issuer && formik.errors.issuer && (
                                        <p className="text-red-500 text-xs">{formik.errors.issuer}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        name="issuedDate"
                                        value={formik.values.issuedDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                    {formik.touched.issuedDate && formik.errors.issuedDate && (
                                        <p className="text-red-500 text-xs">{formik.errors.issuedDate}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="What did you accomplish?"
                                    name="description"
                                    rows={3}
                                    maxLength={200}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y"
                                />
                                
                                <div>
                                    {formik.touched.description && formik.errors.description && (
                                        <p className="text-red-500 text-xs">{formik.errors.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1.5 text-right">{formik.values.description.length}/300</p>
                                </div>  
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Certificate image (optional)</label>

                                {formik.values.certificateImage ? (
                                    <div className="relative rounded-lg border border-gray-200 overflow-hidden">
                                        <img
                                            src={certificatePreviewUrl}
                                            alt="Certificate preview"
                                            className="w-full h-40 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => formik.setFieldValue("certificateImage", null)}
                                            className="cursor-pointer absolute top-2 right-2 bg-black/60 hover:bg-black/75 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6 6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <path d="M17 8l-5-5-5 5" />
                                            <path d="M12 3v12" />
                                        </svg>
                                        <span className="text-xs text-gray-500 font-medium">Click to upload an image</span>
                                        <span className="text-[11px] text-gray-400">PNG, JPG up to 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    formik.setFieldValue("certificateImage", file);
                                                }
                                                e.target.value = "";
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Certificate link (optional)</label>
                                <input
                                    type="url"
                                    name="certUrl"
                                    value={formik.values.certUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Save achievement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeleteTarget(null); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-start gap-3 mb-1">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
                                    <path d="M12 9v4M12 17h.01"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Delete achievement?</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    This will permanently remove <span className="font-semibold text-gray-700">"{deleteTarget.title}"</span>. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2.5 mt-5">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteTarget(null)}
                                className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}