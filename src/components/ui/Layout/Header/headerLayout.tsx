import { useState } from 'react';
import './headerLayout.css';

 
export default function HeaderLayout(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>

            <header className="bg-white border-b border-gray-100">
            <nav className="flex items-center justify-between px-4 sm:px-6 py-3.5 max-w-[1400px] mx-auto">

                <div className="flex items-center gap-6 sm:gap-8">
                <a href="#" className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0">★</span>
                    <span className="font-bold text-[15px] text-gray-900">Spotlight</span>
                </a>

                <ul className="hidden md:flex items-center gap-6">
                    <li><a href="#" className="text-sm font-medium text-blue-600">Stories</a></li>
                    <li><a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Explore</a></li>
                    <li><a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contests</a></li>
                    <li><a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Mentors</a></li>
                    <li><a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Communities</a></li>
                </ul>
                </div>

                <div className="hidden md:flex items-center gap-5">
                <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</a>
                <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Join us</a>
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
                    <div id="mobileMenu" className="hidden md:hidden border-t border-gray-100 px-4 py-3">
                        <ul className="flex flex-col gap-3">
                        <li><a href="#" className="block text-sm font-medium text-blue-600">Stories</a></li>
                        <li><a href="#" className="block text-sm font-medium text-gray-600">Explore</a></li>
                        <li><a href="#" className="block text-sm font-medium text-gray-600">Contests</a></li>
                        <li><a href="#" className="block text-sm font-medium text-gray-600">Mentors</a></li>
                        <li><a href="#" className="block text-sm font-medium text-gray-600">Communities</a></li>
                        </ul>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <a href="/login" className="text-sm font-medium text-gray-600">Log in</a>
                        <a href="/login" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">Join us</a>
                        </div>
                    </div>
                 )}
            </header>         
        </>
    )
}