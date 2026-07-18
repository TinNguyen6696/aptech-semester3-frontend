import DateUtil from "@/lib/dateUtil";
import { IconContestDetail } from "./contestCategoryConfig";


export default function UpcomingBanner({ startDate, endDate }) {
    const daysUntilStart = Math.ceil((new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="mb-8 bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <IconContestDetail.Calendar className="w-5 h-5 text-blue-500" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">Contest hasn't started yet</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Voting opens on <span className="font-semibold text-gray-700">{DateUtil.formatDate(startDate)}</span> and closes on <span className="font-semibold text-gray-700">{DateUtil.formatDate(endDate)}</span>.
                    </p>
                </div>

                {/* Countdown */}
                <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold text-blue-600">{daysUntilStart}</p>
                    <p className="text-xs text-gray-400">days to go</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 rounded-full bg-gray-100">
                <div className="h-full w-0 rounded-full bg-blue-400" />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 font-medium">
                <span>Submissions open</span>
                <span>Voting ends</span>
            </div>
        </div>
    );
}