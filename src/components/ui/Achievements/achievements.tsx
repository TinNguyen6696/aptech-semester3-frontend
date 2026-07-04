

export default function Achievements() {
    const achievements = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/>
                    <path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"/>
                </svg>
            ),
            iconBg: "bg-amber-100",
            title: "First Place — 60-Second Solo",
            badge: { text: "Contest win", bg: "bg-amber-100", color: "text-amber-700" },
            subtitle: "Spotlight Community · Jun 2026",
            description: 'Won the weekly "60-Second Solo" contest with the most community votes.',
            hasCertificate: true,
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                </svg>
            ),
            iconBg: "bg-blue-100",
            title: "AWS Certified Developer",
            badge: { text: "Certification", bg: "bg-blue-100", color: "text-blue-700" },
            subtitle: "Amazon Web Services · Mar 2026",
            description: "Associate-level certification covering cloud application development on AWS.",
            hasCertificate: true,
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/>
                </svg>
            ),
            iconBg: "bg-purple-100",
            title: "Best Creative Dev — HackHCM 2025",
            badge: { text: "Award", bg: "bg-purple-100", color: "text-purple-700" },
            subtitle: "HackHCM Organizers · Nov 2025",
            description: "Recognized for the most creatively designed project at Ho Chi Minh City's annual hackathon.",
            hasCertificate: false,
        },
    ];

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Header */}
            <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
                <p className="text-sm text-gray-500 mt-0.5">Contests, certifications, awards and more</p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {achievements.map((item, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                            {item.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.badge.bg} ${item.badge.color}`}>
                                    {item.badge.text}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start gap-4 text-sm font-semibold">
                            {item.hasCertificate && (
                                <button className="cursor-pointer flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <path d="M15 3h6v6"/><path d="M10 14 21 3"/>
                                    </svg>
                                    Certificate
                                </button>
                            )}
                            <button className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-end">
                <button className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add achievement
                </button>
            </div>
        </div>
    );
}