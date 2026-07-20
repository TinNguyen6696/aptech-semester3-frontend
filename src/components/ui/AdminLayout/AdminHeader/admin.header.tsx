import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { UserInfo } from "@/types/user.types";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    userInfo: UserInfo | null;
}

export default function AdminHeader({ collapsed, onToggle, userInfo }: Props) {
    return (
        <header className="bg-white border-b border-gray-100 px-4 flex items-center justify-between flex-shrink-0 h-14" style={{height:"61px"}}>
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <h1 className="text-sm font-semibold text-gray-700 hidden sm:block">Admin Panel</h1>
            </div>
            <span className="text-xs text-gray-400">
                {userInfo?.firstName} {userInfo?.lastName}
            </span>
        </header>
    );
}