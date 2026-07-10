export default function ConfirmDeleteModal({ isOpen, video, isDeleting, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900 text-center">
          Delete this video?
        </h3>
        <p className="text-sm text-gray-500 text-center mt-1.5">
          {video?.title ? (
            <>Are you sure you want to delete <span className="font-medium text-gray-700">"{video.title}"</span>? This action cannot be undone.</>
          ) : (
            'This action cannot be undone.'
          )}
        </p>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}