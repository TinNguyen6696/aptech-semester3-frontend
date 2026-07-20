import { Outlet, redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/Store/userStore";
import { useState } from "react";
import { StringValue } from "@/lib/stringValue";
import AdminSidebar from "@/components/ui/AdminLayout/AdminSidebar/admin.sidebar";
import AdminHeader from "@/components/ui/AdminLayout/AdminHeader/admin.header";

export const Route = createFileRoute("/_layout_admin/admin")({
    beforeLoad: () => {
        const userInfo = useUserStore.getState().userInfo;
        if (!userInfo || userInfo.role !== StringValue.ADMIN) {
            throw redirect({ to: "/" });
        }
    },
    component: AdminLayout,
});

export default function AdminLayout() {
    const { userInfo } = useUserStore();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar collapsed={collapsed} />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((v) => !v)}
                    userInfo={userInfo}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}