import { useState, useRef, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import './headerLayout.css';
import { StringValue } from '@/lib/stringValue';
import { API } from '@/lib/apiendpoint';
import { useUserStore } from '@/Store/userStore';
 
const NAV_ITEMS = [
    { label: 'Stories', href: '/stories' },
    { label: 'Explores', href: '/explores' },
    { label: 'Contests', href: '/contests' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Communities', href: '/communities' },
    { label: 'MyVideos', href:'/myvideos'}
];


export default function HeaderLayout(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (href) => {
        if (href === '/') return currentPath === '/';
        return currentPath === href || currentPath.startsWith(href + '/');
    };

    const { userInfo, updateUserInfo, clearUserInfo } = useUserStore();
    const previewUrl = userInfo?.profileImageUrl 
        ? `${API.URL}/${userInfo.profileImageUrl}` 
        : null;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        clearUserInfo();  
        localStorage.removeItem(StringValue.ACCESS_TOKEN);
        setIsDropdownOpen(false);
        window.location.href = '/login';
    };

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
                        {NAV_ITEMS.map((item) => (
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
                                        <a href="/profile" className="block px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Profile
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
                            <li><a href="/Stories" className="block text-sm font-medium text-blue-600">Stories</a></li>
                            <li><a href="/explores" className="block text-sm font-medium text-gray-600">Explores</a></li>
                            <li><a href="/contests" className="block text-sm font-medium text-gray-600">Contests</a></li>
                            <li><a href="/mentors" className="block text-sm font-medium text-gray-600">Mentors</a></li>
                            <li><a href="/comunities" className="block text-sm font-medium text-gray-600">Communities</a></li>
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
                                    <a href="/profile" className="text-sm text-gray-600">Profile</a>
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