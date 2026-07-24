import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table, Input, Select, Button, Tag, Space, Tooltip, Modal, Descriptions, Badge } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import VideoExpandModal from "../../Contests/videoExpandModal";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";
import { toast } from "react-toastify";


interface Report {
    id: number;
    videoId: number;
    videoTitle: string;
    description: string;
    status: "Pending" | "Reviewed" | "Actioned";
    createdAt: string;
    reviewedAt: string | null;
    reporter: {
        id: number;
        username: string;
        profileImageUrl: string | null;
    };
    reviewedBy: string | null;
}

const STATUS_COLOR: Record<string, string> = {
    Pending: "warning",
    Reviewed: "processing",
    Actioned: "success",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

export default function AdminReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedVideo, setExpandedVideo] = useState<any>(null);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(API.AXIOS_ADMIN_REPORTS_GET_ALL, {
                params: {
                    page,
                    pageSize,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                },
            });
            if (res.data.isSuccess) {
                const { reports, totalCount } = res.data.data;
                setReports(reports);
                setTotal(totalCount);
            }
        } finally {
            setLoading(false);
        }
    };
    console.log("check report: ", reports)
    useEffect(() => {
        fetchReports();
    }, [page, pageSize, search, statusFilter]);

    const handleUpdateStatus = async (report: Report, status: "Reviewed" | "Actioned") => {
        setActionLoading(true);
        try {
            await axiosClient.put(API.AXIOS_ADMIN_REPORT_UPDATE_STATUS.replace("{id}", String(report.id)), { status });

            setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status } : r));
            if (selectedReport?.id === report.id) {
                setSelectedReport((prev) => prev ? { ...prev, status } : null);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message ?? "Something went wrong");
        } finally {
            setActionLoading(false);
        }
    };

    const columns: ColumnsType<Report> = [
        {
            title: "Reporter",
            key: "reporter",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <UserAvatar
                        profileImageUrl={record.reporter.profileImageUrl}
                        username={record.reporter.username}
                        size={28}
                    />
                    <span className="text-sm text-gray-900">@{record.reporter.username}</span>
                </div>
            ),
        },
        {
            title: "Video",
            key: "video",
            width: 140,
            render: (_, record) => (
                <div
                    className="relative w-32 aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setExpandedVideo({
                        videoUrl: record.videoUrl.startsWith("http") ? record.videoUrl : `${API.URL}${record.videoUrl}`,
                        videoTitle: record.videoTitle,
                    })}
                >
                    <video
                        src={record.videoUrl.startsWith("http") ? record.videoUrl : `${API.URL}${record.videoUrl}`}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Target",
            key: "target",
            render: (_, record) => (
                <div>
                    <Tag color="blue" className="text-xs mb-1">Video</Tag>
                    <p className="text-xs text-gray-500 max-w-[180px] truncate">{record.videoTitle}</p>
                </div>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (desc) => <span className="text-sm text-gray-600">{desc}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge status={STATUS_COLOR[status] as any} text={
                    <span className="capitalize text-xs">{status}</span>
                } />
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => <span className="text-xs text-gray-400">{formatDate(date)}</span>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 130,
            render: (_, record) => (
                <Space size="small">
                    {record.status === "Pending" && (
                        <Tooltip title="Mark as Reviewed">
                            <Button
                                type="text"
                                size="small"
                                icon={<CheckCircleOutlined style={{ color: "#16a34a" }} />}
                                onClick={() => handleUpdateStatus(record, "Reviewed")}
                            />
                        </Tooltip>
                    )}
                    {(record.status === "Pending" || record.status === "Reviewed") && (
                        <Tooltip title="Action taken">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleUpdateStatus(record, "Actioned")}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Reports</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{total} total reports</p>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchReports} loading={loading}>
                    Refresh
                </Button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="Search reporter, reason..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-64"
                    allowClear
                />
                <Select
                    value={statusFilter}
                    onChange={(v) => { setStatusFilter(v); setPage(1); }}
                    className="w-36"
                    options={[
                        { label: "All status", value: "all" },
                        { label: "Pending", value: "Pending" },
                        { label: "Reviewed", value: "Reviewed" },
                        { label: "Actioned", value: "Actioned" },
                    ]}
                />
            </div>

            <Table
                columns={columns}
                dataSource={reports}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (t) => `${t} reports`,
                    onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                }}
                size="middle"
                className="bg-white rounded-lg"
            />

            <Modal
                open={modalOpen}
                onCancel={() => { setModalOpen(false); setSelectedReport(null); }}
                footer={
                    selectedReport && selectedReport.status !== "Actioned" ? (
                        <Space>
                            {selectedReport?.status === "Pending" && (
                                <Button onClick={() => handleUpdateStatus(selectedReport, "Reviewed")}>
                                    Mark Reviewed
                                </Button>
                            )}
                            <Button type="primary" onClick={() => handleUpdateStatus(selectedReport, "Actioned")}>
                                Action Taken
                            </Button>
                        </Space>
                    ) : null
                }
                title="Report Detail"
                width={560}
            >
                {selectedReport && (
                    <div className="space-y-4 pt-2">
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Reporter">
                                <div className="flex items-center gap-2">
                                    <UserAvatar
                                        profileImageUrl={selectedReport.reporter.profileImageUrl}
                                        username={selectedReport.reporter.username}
                                        size={24}
                                    />
                                    @{selectedReport.reporter.username}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Video">
                                {selectedReport.videoTitle}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">
                                {selectedReport.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Badge
                                    status={STATUS_COLOR[selectedReport.status] as any}
                                    text={<span>{selectedReport.status}</span>}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Reported at">
                                {formatDate(selectedReport.createdAt)}
                            </Descriptions.Item>
                            {selectedReport.reviewedAt && (
                                <Descriptions.Item label="Reviewed at">
                                    {formatDate(selectedReport.reviewedAt)}
                                </Descriptions.Item>
                            )}
                            {selectedReport.reviewedBy && (
                                <Descriptions.Item label="Reviewed by">
                                    {selectedReport.reviewedBy}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>
                )}
            </Modal>

            {expandedVideo && (
                <VideoExpandModal video={expandedVideo} onClose={() => setExpandedVideo(null)} />
            )}
        </div>
    );
}