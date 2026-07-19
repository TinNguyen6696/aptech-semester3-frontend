import { IconContestDetail } from "./contestCategoryConfig";

export default function DeleteConfirmModal({ open, onClose, onConfirm, loading }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <IconContestDetail.Trash className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">Delete this entry?</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    This action cannot be undone. Your entry will be removed from the contest.
                </p>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Deleting..." : "Delete entry"}
                    </button>
                </div>
            </div>
        </div>
    );
}