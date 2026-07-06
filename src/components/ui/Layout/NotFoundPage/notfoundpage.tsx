import { Link } from "@tanstack/react-router"

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full text-center">
                
                <svg className="mx-auto w-56 h-56" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="90" fill="#EFF6FF"/>
                    <path d="M70 85 Q100 60 130 85" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round"/>
                    <circle cx="75" cy="95" r="6" fill="#3B82F6"/>
                    <circle cx="125" cy="95" r="6" fill="#3B82F6"/>
                    <path d="M75 130 Q100 115 125 130" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" fill="none"/>
                </svg>

                <h1 className="mt-6 text-7xl font-extrabold text-gray-900 tracking-tight">404</h1>
                
                <h2 className="mt-3 text-xl font-bold text-gray-800">
                    Page not found
                </h2>
                
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                   The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/>
                        </svg>
                        Back to Home
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-lg border border-gray-200 transition-colors"
                    >
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    )
}