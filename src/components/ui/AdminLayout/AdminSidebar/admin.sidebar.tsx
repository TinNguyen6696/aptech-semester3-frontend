import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: "▦" },
    { label: "Users", href: "/admin/users", icon: "👤" },
    // { label: "Mentors", href: "/admin/mentors", icon: "🎓" },
    // { label: "Contests", href: "/admin/contests", icon: "🏆" },
    { label: "Communities", href: "/admin/communities", icon: "👥" },
    { label: "Reports", href: "/admin/reports", icon: "🚩" },
];

interface Props {
    collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: Props) {
    return (
        <aside className={`
            flex-shrink-0 bg-white border-r border-gray-100 flex flex-col
            transition-all duration-300
            ${collapsed ? "w-16" : "w-60"}
        `}>
            <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100 overflow-hidden">
                <span className="w-7 h-7 flex-shrink-0 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm">★</span>
                {!collapsed && (
                    <div className="flex gap-3 items-center">
                        <span className="font-bold text-[15px] text-gray-900">Spotlight</span>
                        <p className="text-[11px] text-gray-400 leading-none mt-0.5">Admin Panel</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-2 py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                title={collapsed ? item.label : undefined}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom */}
            <div className="px-2 py-4 border-t border-gray-100 space-y-1">
                <a
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    title={collapsed ? "Back to site" : undefined}
                >
                    <HomeOutlined className="flex-shrink-0" />
                    {!collapsed && <span>Back to site</span>}
                </a>
                <button
                    onClick={() => {/* TODO: logout */}}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogoutOutlined className="flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}