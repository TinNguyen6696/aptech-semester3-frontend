import type { UserInfo } from "@/types/user.types";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table, Input, Select, Button, Tag, Space, Tooltip, Modal, Descriptions } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";

const ROLE_COLOR: Record<string, string> = {
    Member: "blue",
    Mentor: "purple",
    Recruiter: "orange",
    Admin: "red",
};

const STATUS_COLOR: Record<string, string> = {
    active: "success",
    banned: "error",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

export default function AdminUsers() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(API.AXIOS_ADMIN_USERS_GET_ALL, {
                params: {
                    page,
                    pageSize,
                    role: roleFilter !== "all" ? roleFilter : undefined,
                },
            });
            if (res.data.isSuccess) {
                const { users, totalCount } = res.data.data;
                setUsers(users);
                setTotal(totalCount);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, pageSize, search, roleFilter, statusFilter]);

    const handleBanToggle = async (user: UserInfo) => {
        const res = await axiosClient.put(API.AXIOS_ADMIN_USER_TOGGLE_ACTIVE.replace("{id}", user.id));
        if (res.data.isSuccess) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id
                        ? { ...u, isActive: !u.isActive }
                        : u
                )
            );
        }
    };

    const handleViewProfile = async (user: UserInfo) => {
        setModalOpen(true);
        setModalLoading(true);
        try {
            const res = await axiosClient.get(API.AXIOS_ADMIN_USER_GET_BY_ID.replace("{id}", String(user.id)));
            if (res.data.isSuccess) {
                setSelectedUser(res.data.data);
                console.log("check : ", res.data)
            }
        } finally {
            setModalLoading(false);
        }
    };

    const columns: ColumnsType<UserInfo> = [
        {
            title: "User",
            key: "user",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <UserAvatar
                        profileImageUrl={record.profileImageUrl}
                        firstName={record.firstName}
                        lastName={record.lastName}
                        username={record.username}
                        size={36}
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                            {record.firstName} {record.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">@{record.username}</p>
                    </div>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => <span className="text-sm text-gray-600">{email}</span>,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={ROLE_COLOR[role] ?? "default"} className="capitalize text-xs">
                    {role}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <Tag color={isActive ? "success" : "error"} className="text-xs">
                    {isActive ? "Active" : "Banned"}
                </Tag>
            ),
        },
        {
            title: "Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <span className="text-xs text-gray-400">{formatDate(date)}</span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View profile">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewProfile(record)}
                        />
                    </Tooltip>
                    <Tooltip title={record.isActive ? "Ban user" : "Unban user"}>
                        <Button
                            type="text"
                            size="small"
                            danger={record.isActive}
                            icon={
                                record.isActive
                                    ? <StopOutlined />
                                    : <CheckCircleOutlined style={{ color: "#16a34a" }} />
                            }
                            onClick={() => handleBanToggle(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Users</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{total} total users</p>
                </div>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchUsers}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="Search name, email, username..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-64"
                    allowClear
                />
                <Select
                    placeholder="All roles"
                    value={roleFilter}
                    onChange={(v) => { setRoleFilter(v); setPage(1); }}
                    className="w-36"
                    options={[
                        { label: "All roles", value: "all" },
                        { label: "Member", value: "member" },
                        { label: "Mentor", value: "mentor" },
                        { label: "Recruiter", value: "recruiter" },
                        { label: "Admin", value: "admin" },
                    ]}
                />
                <Select
                    placeholder="All status"
                    value={statusFilter}
                    onChange={(v) => { setStatusFilter(v); setPage(1); }}
                    allowClear
                    className="w-36"
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Banned", value: "banned" },
                    ]}
                />
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (t) => `${t} users`,
                    onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                }}
                size="middle"
                className="bg-white rounded-lg"
            />

            <Modal
                open={modalOpen}
                onCancel={() => { setModalOpen(false); setSelectedUser(null); }}
                footer={null}
                title="User Profile"
                loading={modalLoading}
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <UserAvatar
                                profileImageUrl={selectedUser.profileImageUrl}
                                firstName={selectedUser.firstName}
                                lastName={selectedUser.lastName}
                                username={selectedUser.username}
                                size={64}
                                className="text-xl"
                            />
                            <div>
                                <p className="text-base font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                                <p className="text-sm text-gray-400">@{selectedUser.username}</p>
                            </div>
                        </div>
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
                            <Descriptions.Item label="Role">
                                <Tag color={ROLE_COLOR[selectedUser.role] ?? "default"}>{selectedUser.role}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={selectedUser.isActive ? "success" : "error"}>
                                    {selectedUser.isActive ? "Active" : "Banned"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Joined">{formatDate(selectedUser.createdAt)}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
}


