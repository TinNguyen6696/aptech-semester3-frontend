import { useState, useRef, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import './headerLayout.css';
import { StringValue } from '@/lib/stringValue';
import { API } from '@/lib/apiendpoint';
import { useUserStore } from '@/Store/userStore';
import axiosClient from '@/services/axiosClient';
import type { Notification } from '@/types/notification.types';
import DateUtil from '@/lib/dateUtil';

const ALL_ROLES = ['guest', StringValue.MEMBER, StringValue.MENTOR, StringValue.RECRUITER, StringValue.ADMIN];

const NAV_ITEMS = [
    { label: 'Explores', href: '/explores', roles: ALL_ROLES },
    { label: 'Contests', href: '/contests', roles: ALL_ROLES },
    { label: 'Mentors', href: '/mentors', roles: ['guest', StringValue.MEMBER] },
    { label: 'Communities', href: '/communities', roles: ALL_ROLES },
    { label: 'Opportunities', href: '/opportunities', roles: ALL_ROLES },
    { label: 'MyVideos', href:'/myvideos', roles: [StringValue.MEMBER] }
];
const DISMISS_KEY = "msg_badge_dismissed_until";

export default function HeaderLayout(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notiOpen, setNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notiLoading, setNotiLoading] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const isBadgeDismissed = () => {
        const until = localStorage.getItem(DISMISS_KEY);
        if (!until) return false;
        return Date.now() < parseInt(until);
    };
    const [badgeDismissed, setBadgeDismissed] = useState(isBadgeDismissed);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (href) => {
        if (href === '/') return currentPath === '/';
        return currentPath === href || currentPath.startsWith(href + '/');
    };
    const { userInfo, updateUserInfo, clearUserInfo } = useUserStore();
    const currentRole = userInfo?.role ?? 'guest';
    const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));
    const previewUrl = userInfo?.profileImageUrl
        ? `${API.URL}/${userInfo.profileImageUrl}`
        : StringValue.USER_AVATAR_DEFAULT;
     
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setNotiOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!userInfo) return;
        const fetchUnread = async () => {
            try {
                const res = await axiosClient.get(API.AXIOS_MESSAGE_GET_UNREAD);
                if (res.data.isSuccess) {
                    setUnreadCount(res.data.data ?? 0);
                }
            } catch (error) {
                console.error("Failed to fetch unread message count:", error);
            }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [userInfo]);
   
    useEffect(() => {
        if (!badgeDismissed) return;
        const until = parseInt(localStorage.getItem(DISMISS_KEY) ?? "0");
        const remaining = until - Date.now();
        if (remaining <= 0) {
            setBadgeDismissed(false);
            return;
        }
        const t = setTimeout(() => {
            setBadgeDismissed(false);
            localStorage.removeItem(DISMISS_KEY);
        }, remaining);
        return () => clearTimeout(t);
    }, [badgeDismissed]);

    const handleLogout = () => {
        clearUserInfo();
        localStorage.removeItem(StringValue.ACCESS_TOKEN);
        localStorage.removeItem(StringValue.REFRESH_TOKEN);
        setIsDropdownOpen(false);
        window.location.href = '/login';
    };

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
        setIsDropdownOpen(false);
    };

    const handleMarkRead = async (id: number) => {
        try {
            await axiosClient.put(API.AXIOS_NOTIFICATIONS_READ.replace('{id}', String(id)));
            setNotifications((prev) =>
                prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch {
            // silent
        }
    };

    const unreadNotiCount = notifications?.filter((n) => !n.isRead).length;

    const getInitial = () => {
        const name = userInfo?.fullName || userInfo?.name || userInfo?.email || '';
        return name.charAt(0).toUpperCase();
    };

    return (
        <>

            <header className="bg-white border-b border-gray-100">
            <nav className="flex items-center justify-between px-4 sm:px-6 py-3.5 max-w-[1400px] mx-auto">

                <div className="flex items-center gap-6 sm:gap-8">
                    <a href="/" className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0">★</span>
                        <span className="font-bold text-[15px] text-gray-900">Spotlight</span>
                    </a>
                    <ul className="hidden md:flex items-center gap-6">
                        {visibleNavItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                
                </div>

                <div className="hidden md:flex items-center gap-5">
                    {userInfo && (
                        <div ref={notiRef} className="relative">
                            <button
                                onClick={handleToggleNoti}
                                className="relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                                </svg>
                                {unreadNotiCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadNotiCount > 9 ? "9+" : unreadNotiCount}
                                    </span>
                                )}
                            </button>

                            {notiOpen && (
                                <div className="absolute right-0 top-11 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-800">Notifications</span>
                                        {unreadNotiCount > 0 && (
                                            <span className="text-xs text-blue-600 font-medium">{unreadNotiCount} new</span>
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
                                                <div key={n.id} className={`px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/50" : ""}`}>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-800">{n.content}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{DateUtil.timeAgo(n.createdAt+'Z')}</p>
                                                    </div>
                                                    {!n.isRead && (
                                                        <button
                                                            onClick={() => handleMarkRead(n.id)}
                                                            className="flex-shrink-0 p-1.5 cursor-pointer rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {userInfo && (
                        <a href="/messages"
                            className="relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                            onClick={() => {
                                const until = Date.now() + 10 * 60 * 1000;
                                localStorage.setItem(DISMISS_KEY, until.toString());
                                setBadgeDismissed(true);
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            {unreadCount > 0 && !badgeDismissed && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </a>
                    )}
                    {userInfo ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = StringValue.USER_AVATAR_DEFAULT;
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                            {getInitial()}
                                        </span>
                                    )}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-50">
                                        <div className="px-3.5 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {`${userInfo.firstName} ${userInfo.lastName}`}
                                            </p>
                                            {userInfo.email && (
                                                <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                                            )}
                                        </div>
                                        {currentRole === StringValue.ADMIN &&(
                                            <a href="/admin" className="block px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                                Admin Dashboard
                                            </a> 
                                        )}
                                        <a href="/profile" className="block px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Profile
                                        </a>
                                        <a href="/follow" className="block px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Follow
                                        </a>
                                        <a href="/messages" className="block px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Messages
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-gray-50"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</a>
                                <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Join us</a>
                            </>
                        )}
                </div>

                <button 
                    className="md:hidden p-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </nav>
                {isMenuOpen && (
                    <div id="mobileMenu" className="md:hidden border-t border-gray-100 px-4 py-3">
                        <ul className="flex flex-col gap-3">
                            {visibleNavItems.map((item) => (
                                <li key={item.href}><a href={item.href} className="block text-sm font-medium text-gray-600">{item.label}</a></li>
                            ))}
                        </ul>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {userInfo ? (
                                <div className="flex items-center gap-3">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="avatar"
                                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = StringValue.USER_AVATAR_DEFAULT;
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                            {getInitial()}
                                        </span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {`${userInfo.firstName} ${userInfo.lastName}`}
                                        </p>
                                        {userInfo.email && (
                                            <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <a href="/login" className="text-sm font-medium text-gray-600">Log in</a>
                                    <a href="/login" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">Join us</a>
                                </div>
                            )}

                            {userInfo && (
                                <div className="flex flex-col gap-2 mt-3">
                                    {currentRole === StringValue.ADMIN &&(
                                        <a href="/admin" className="text-sm text-gray-600">Admin Dashboard</a>
                                    )}
                                    <a href="/profile" className="text-sm text-gray-600">Profile</a>
                                    <a href="/messages" className="text-sm text-gray-600">Messages</a>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-sm text-red-500"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                 )}
            </header>         
        </>
    )
}