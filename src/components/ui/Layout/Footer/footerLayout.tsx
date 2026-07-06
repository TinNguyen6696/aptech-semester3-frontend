import './footerLayout.css'

export default function FooterLayout(){

    return (
        <>      
            <footer className="main-footer pt-10 pb-6">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-8 pb-8">
                        <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 mb-2.5">
                            <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">★</span>
                            <span className="font-bold text-[15px] text-gray-900">Spotlight</span>
                        </div>
                        <p className="text-[13px] text-gray-500 m-0">Every talent has a place to be seen.</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] tracking-wider font-bold text-gray-400 uppercase mb-3.5">Discover</h4>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Explore</a></li>
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Stories</a></li>
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Categories</a></li>
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Contests</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="text-[11px] tracking-wider font-bold text-gray-400 uppercase mb-3.5">Connect</h4>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Communities</a></li>
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">Mentors</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] tracking-wider font-bold text-gray-400 uppercase mb-3.5">Company</h4>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                            <li><a href="#" className="text-[13.5px] text-gray-600 hover:text-gray-900 no-underline">About</a></li>
                        </ul>
                    </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row justify-between gap-2 text-[12.5px] text-gray-400">
                        <span>© 2026 Spotlight. All rights reserved.</span>
                        <span>Made for creators, everywhere.</span>
                    </div>
                </div>
            </footer>       
                        
        </>
    )
}