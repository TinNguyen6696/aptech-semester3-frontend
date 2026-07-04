import { createFileRoute, redirect } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <span className="inline-flex items-center gap-1.5 bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"/></svg>
              A community for every kind of creator
            </span>

            <h1 className="mt-6 text-[40px] sm:text-5xl lg:text-[52px] font-extrabold leading-[1.08] text-gray-900">
              Every talent has<br className="hidden sm:block"/>
              a place to be <span className="font-display italic text-blue-600 font-semibold">seen.</span>
            </h1>

            <p className="mt-6 text-gray-500 text-[15px] leading-relaxed max-w-md">
              Spotlight is where singers, dancers, artists, and creators of all kinds share their work, find their people, and get the recognition they've earned.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors shadow-sm">
                <span className="text-base leading-none">+</span> Share your talent
              </button>
              <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold px-5 py-3 rounded-lg border border-gray-200 transition-colors">
                Explore stories
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full ring-2 ring-white bg-purple-500 flex items-center justify-center text-[11px] font-bold text-white">MJ</span>
                <span className="w-8 h-8 rounded-full ring-2 ring-white bg-orange-400 flex items-center justify-center text-[11px] font-bold text-white">OK</span>
                <span className="w-8 h-8 rounded-full ring-2 ring-white bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white">NA</span>
                <span className="w-8 h-8 rounded-full ring-2 ring-white bg-blue-600 flex items-center justify-center text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-900">50,000+ creators</p>
                <p className="text-xs text-gray-400">already telling their story</p>
              </div>
            </div>
          </div>

          <div className="relative h-[380px] sm:h-[440px] flex items-center justify-center">

            <div className="card-tilt-1 absolute w-[230px] h-[300px] rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl p-4 flex flex-col justify-between top-2 left-4 sm:left-10">
              <span className="self-start bg-white/25 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">SINGER</span>
              <button className="self-center w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c3aed"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <p className="text-white text-xs font-medium">Elena · live loop</p>
            </div>

            <div className="card-tilt-3 absolute w-[210px] h-[220px] rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl p-4 flex flex-col justify-between bottom-0 left-1/2 -translate-x-1/2 sm:left-[38%]">
              <span className="self-start bg-white/25 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">ARTIST</span>
              <button className="self-center w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>

            <div className="card-tilt-2 absolute w-[220px] h-[290px] rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl p-4 flex flex-col justify-between top-4 right-2 sm:right-6">
              <div className="flex items-start justify-between">
                <span className="bg-white/25 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">DANCER</span>
              </div>
              <button className="self-center w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ea580c"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <p className="text-white text-xs font-medium">Dev · rooftop solo</p>
            </div>

            <div className="absolute top-0 right-6 sm:right-10 bg-white rounded-xl shadow-lg px-3.5 py-2 flex items-center gap-1.5 z-10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"/></svg>
              <span className="text-xs font-semibold text-gray-700">"Got my first gig here"</span>
            </div>

          </div>
        </div>
      </section>

      
      <section className="bg-gray-950 text-white px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-[28px] font-bold mb-12">From your room to the world — here's how</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            <div>
              <p className="text-3xl font-extrabold text-blue-500 mb-3">01</p>
              <h3 className="text-base font-bold mb-2">Upload your talent</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Share a video of your performance or creation — tag it so the right people find it.</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-purple-400 mb-3">02</p>
              <h3 className="text-base font-bold mb-2">Connect &amp; get feedback</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Join communities, swap notes, and grow with people who share your craft.</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400 mb-3">03</p>
              <h3 className="text-base font-bold mb-2">Get discovered</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Mentors and scouts find you and open doors to gigs, auditions, and collabs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
