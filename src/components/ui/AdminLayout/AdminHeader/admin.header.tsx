import { useState, useRef, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, LogoutOutlined, GlobalOutlined } from "@ant-design/icons";
import type { UserInfo } from "@/types/user.types";
import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";
import { StringValue } from "@/lib/stringValue";
import { useNavigate } from "@tanstack/react-router";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    userInfo: UserInfo | null;
    clearUserInfo:() => void;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminHeader({ collapsed, onToggle, userInfo, clearUserInfo }: Props) {
    const navigate = useNavigate();
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [notiOpen, setNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notiLoading, setNotiLoading] = useState(false);

    const avatarRef = useRef<HTMLDivElement>(null);
    const notiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
            if (notiRef.current && !notiRef.current.contains(e.target as Node)) setNotiOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchNotifications = async () => {
        setNotiLoading(true);
        try {
            const res = await axiosClient.get(API.AXIOS_NOTIFICATIONS_GET_ALL);
            if (res.data.isSuccess) {
                const data = res.data.data.notifications;
                const list = Array.isArray(data) ? data
                           : Array.isArray(data?.notifications) ? data.notifications
                           : Array.isArray(data?.items) ? data.items
                           : [];
                setNotifications(list);
            }
        } catch (e) {
            console.error("noti error:", e);
        } finally {
            setNotiLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleToggleNoti = () => {
        if (!notiOpen) fetchNotifications();
        setNotiOpen((v) => !v);
        setAvatarOpen(false);
    };

    const handleToggleAvatar = () => {
        setAvatarOpen((v) => !v);
        setNotiOpen(false);
    };

    const handleLogout = () => {
        clearUserInfo();
        localStorage.removeItem(StringValue.ACCESS_TOKEN);
        localStorage.removeItem(StringValue.REFRESH_TOKEN);
        window.location.href = '/login';
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    
    const avatarSrc = userInfo?.profileImageUrl
        ? `${API.URL}${userInfo.profileImageUrl}`
        : StringValue.USER_AVATAR_DEFAULT;

    const initials = `${userInfo?.firstName?.[0] ?? ""}${userInfo?.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <header className="bg-white border-b border-gray-100 px-4 flex items-center justify-between flex-shrink-0" style={{ height: "61px" }}>
            {/* Left */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <h1 className="text-sm font-semibold text-gray-700 hidden sm:block">Admin Panel</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Bell */}
                <div ref={notiRef} className="relative">
                    <button
                        onClick={handleToggleNoti}
                        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <BellOutlined style={{ fontSize: 18 }} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {notiOpen && (
                        <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="text-xs text-blue-600 font-medium">{unreadCount} new</span>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                {notiLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : notifications?.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                                ) : (
                                    notifications?.map((n) => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/50" : ""}`}>
                                            <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div ref={avatarRef} className="relative">
                    <button onClick={handleToggleAvatar} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                        {userInfo?.profileImageUrl ? (
                            <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                {initials}
                            </span>
                        )}
                        <span className="text-xs text-gray-600 font-medium hidden sm:block">
                            {userInfo?.firstName} {userInfo?.lastName}
                        </span>
                    </button>

                    {avatarOpen && (
                        <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-1">
                            <button
                                onClick={() => window.open("/", "_blank")}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <GlobalOutlined />
                                Main site
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogoutOutlined />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}