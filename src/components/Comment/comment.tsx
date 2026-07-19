
export default function CommentItem({ comment }) {
    const initials = comment.owner?.username?.slice(0, 2).toUpperCase() ?? "??";

    return (
        <div className="flex gap-3">
            <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {initials}
            </span>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{comment.owner?.username}</span>
                    <span className="text-xs text-gray-400">{comment.formattedDate}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
            </div>
        </div>
    );
}