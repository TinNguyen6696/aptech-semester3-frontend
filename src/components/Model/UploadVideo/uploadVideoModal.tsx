import { useState, useRef } from 'react';

const CATEGORIES = ['Music', 'Dance', 'Art', 'Coding', 'Acting', 'Comedy', 'Writing', 'Photo'];

export default function UploadVideoModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('video/')) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handlePublish = () => {
    // Giả lập upload progress — thay bằng logic call API thật của bạn
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetAndClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setUploadProgress(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Upload your talent</h2>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Drop zone / preview */}
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Drag and drop your video here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or <span className="text-blue-600 font-medium">browse</span> from your device · MP4, MOV up to 500MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
              <video src={previewUrl} className="w-full h-full object-contain" controls />
              <button
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setFile(null);
                  setPreviewUrl(null);
                  setUploadProgress(null);
                }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* File info */}
          {file && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="truncate">{file.name}</span>
              <span className="text-gray-300">·</span>
              <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress !== null && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600">
                  {uploadProgress < 100 ? 'Uploading...' : 'Upload complete'}
                </span>
                <span className="text-xs text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell viewers about your performance..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={resetAndClose}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!file || !title || !category}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Publish
          </button>
        </div>

      </div>
    </div>
  );
}