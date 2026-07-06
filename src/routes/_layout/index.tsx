import { createFileRoute, redirect } from "@tanstack/react-router"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/PageTitle/pagetitle"
import { API } from "@/lib/apiendpoint"

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
})

function VideoCard({
  videoSrc,
  poster,
  badge,
  caption,
  className,
  playButtonSize = "w-14 h-14",
  iconColor,
}: {
  videoSrc: string
  poster?: string
  badge: string
  caption?: string
  className: string
  playButtonSize?: string
  iconColor: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className={`${className} group rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* lớp phủ tối nhẹ để chữ/badge dễ đọc trên nền video */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <span className="self-start bg-white/25 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
          {badge}
        </span>

        <button
          onClick={togglePlay}
          className={`self-center ${playButtonSize} rounded-full bg-white flex items-center justify-center shadow-lg
            opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
            transition-all duration-200
            ${!isPlaying ? "opacity-100 scale-100" : ""}`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={iconColor}>
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {caption && <p className="text-white text-xs font-medium">{caption}</p>}
        {!caption && <div />}
      </div>
    </div>
  )
}





function HomePage() {
  return (
    <>
      <PageTitle title={"Home"} />
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

          <div className="relative flex items-center justify-center pt-8">

            <div className="absolute -top-6 sm:-top-8 right-2 sm:right-4 bg-white rounded-xl shadow-lg px-3.5 py-2 flex items-center gap-1.5 z-40">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"/></svg>
              <span className="text-xs font-semibold text-gray-700">"Got my first gig here"</span>
            </div>

            <div className="relative w-full max-w-[340px] sm:max-w-[480px] h-[345px] sm:h-[420px] mt-6">

              <VideoCard
                className="absolute top-0 left-0 w-[150px] sm:w-[200px] h-[220px] sm:h-[260px] rotate-[-6deg] z-10"
                videoSrc={API.URL + "/uploads/14599055_1080_1920_30fps.mp4"}
                badge="SINGER"
                caption="Elena · live loop"
                iconColor="#7c3aed"
              />

              <VideoCard
                className="absolute top-4 sm:top-6 right-0 w-[150px] sm:w-[200px] h-[220px] sm:h-[260px] rotate-[5deg] z-20"
                videoSrc={API.URL + "/uploads/14599113_1080_1920_30fps.mp4"}
                badge="DANCER"
                caption="Dev · rooftop solo"
                iconColor="#ea580c"
              />

              <VideoCard
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140px] sm:w-[180px] h-[150px] sm:h-[190px] rotate-[-3deg] z-30 ring-4 ring-white"
                videoSrc={API.URL + "/uploads/16183418_2160_3840_30fps.mp4"}
                badge="ARTIST"
                playButtonSize="w-11 h-11"
                iconColor="#059669"
              />

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
