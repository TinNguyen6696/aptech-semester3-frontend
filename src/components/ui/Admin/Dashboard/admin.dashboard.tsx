import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Card, Row, Col, Statistic, Table, Tag, Skeleton } from "antd";
import {
    UserOutlined,
    VideoCameraOutlined,
    TrophyOutlined,
    TeamOutlined,
    BulbOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";

interface RecentUser {
    id: number;
    username: string;
    email: string;
    role: "Member" | "Mentor" | "Recruiter" | "Admin";
    isActive: boolean;
    emailConfirmed: boolean;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    createdAt: string;
}

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    memberCount: number;
    mentorCount: number;
    recruiterCount: number;
    adminCount: number;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalContests: number;
    endedContests: number;
    totalOpportunities: number;
    totalCommunityPosts: number;
    totalMessages: number;
    newUsersLast7Days: number;
    newUsersThisMonth: number;
    newVideosLast7Days: number;
    recentUsers: RecentUser[];
}

const ROLE_COLOR: Record<string, string> = {
    member: "blue",
    mentor: "purple",
    recruiter: "orange",
    admin: "red",
};

function StatCard({
    title,
    value,
    icon,
    color,
    suffix,
    loading,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
    loading?: boolean;
}) {
    return (
        <Card className="rounded-xl border border-gray-100 shadow-none hover:shadow-sm transition-shadow">
            {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
                <div className="flex items-center gap-4">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                        style={{ backgroundColor: color }}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">{title}</p>
                        <Statistic
                            value={value}
                            suffix={suffix}
                            valueStyle={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}
                        />
                    </div>
                </div>
            )}
        </Card>
    );
}

function RoleBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
                <span className="capitalize">{label}</span>
                <span>{count.toLocaleString()} ({pct}%)</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(API.AXIOS_ADMIN_DASHBOARD);
                if (res.data.isSuccess) setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const recentUsersColumns: ColumnsType<RecentUser> = [
        {
            title: "Name",
            dataIndex: "username",
            key: "name",
            render: (name: string) => <span className="text-sm font-medium text-gray-800">{name}</span>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => <span className="text-xs text-gray-400">{email}</span>,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const color = ROLE_COLOR[role?.toLowerCase()];
                return (
                    <Tag color={color} className="capitalize text-xs">{role}</Tag>
                )
            },
        },
        {
            title: "Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => (
                <span className="text-xs text-gray-400">
                    {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-400 mt-0.5">Overview of your platform</p>
            </div>

            {/* Main stats */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<UserOutlined />} color="#2563eb" loading={loading} />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Total Videos" value={stats?.totalVideos ?? 0} icon={<VideoCameraOutlined />} color="#7c3aed" loading={loading} />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Total Views" value={stats?.totalViews ?? 0} icon={<RiseOutlined />} color="#0891b2" loading={loading} />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Community Posts" value={stats?.totalCommunityPosts ?? 0} icon={<TeamOutlined />} color="#059669" loading={loading} />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Total Contests" value={stats?.totalContests ?? 0} icon={<TrophyOutlined />} color="#d97706" loading={loading} />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard title="Opportunities" value={stats?.totalOpportunities ?? 0} icon={<BulbOutlined />} color="#db2777" loading={loading} />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card
                        title={<span className="text-sm font-semibold text-gray-800">User Breakdown</span>}
                        className="rounded-xl border border-gray-100 shadow-none h-full"
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-400">Active</p>
                                        <p className="text-xl font-bold text-green-600">{(stats?.activeUsers ?? 0).toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-400">Banned</p>
                                        <p className="text-xl font-bold text-red-500">{(stats?.bannedUsers ?? 0).toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-400">New this month</p>
                                        <p className="text-xl font-bold text-blue-600">+{stats?.newUsersThisMonth ?? 0}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <RoleBar label="member" count={stats?.memberCount ?? 0} total={stats?.totalUsers ?? 1} color="#2563eb" />
                                    <RoleBar label="mentor" count={stats?.mentorCount ?? 0} total={stats?.totalUsers ?? 1} color="#7c3aed" />
                                    <RoleBar label="recruiter" count={stats?.recruiterCount ?? 0} total={stats?.totalUsers ?? 1} color="#d97706" />
                                    <RoleBar label="admin" count={stats?.adminCount ?? 0} total={stats?.totalUsers ?? 1} color="#dc2626" />
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Quick stats */}
                <Col xs={24} lg={14}>
                    <Card
                        title={<span className="text-sm font-semibold text-gray-800">Platform Stats</span>}
                        className="rounded-xl border border-gray-100 shadow-none h-full"
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Likes", value: stats?.totalLikes ?? 0, color: "text-pink-500" },
                                    { label: "New Users (7 days)", value: stats?.newUsersLast7Days ?? 0, color: "text-green-600" },
                                    { label: "Total Contests", value: stats?.totalContests ?? 0, color: "text-amber-600" },
                                    { label: "Ended Contests", value: stats?.endedContests ?? 0, color: "text-gray-500" },
                                    { label: "Total Messages", value: stats?.totalMessages ?? 0, color: "text-blue-500" },
                                    { label: "Total Opportunities", value: stats?.totalOpportunities ?? 0, color: "text-purple-500" },
                                ].map((item) => (
                                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                                        <p className={`text-xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Recent users */}
            <Card
                title={<span className="text-sm font-semibold text-gray-800">Recent Users</span>}
                extra={<a href="/admin/users" className="text-xs text-blue-500 hover:text-blue-600">View all →</a>}
                className="rounded-xl border border-gray-100 shadow-none"
            >
                <Table
                    columns={recentUsersColumns}
                    dataSource={stats?.recentUsers}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    loading={loading}
                />
            </Card>
        </div>
    );
}
