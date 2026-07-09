import { API } from '@/lib/apiendpoint';
import { StringValue } from '@/lib/stringValue';
import axiosClient from '@/services/axiosClient';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const CATEGORIES = ['Singer', 'Dancer', 'Artist', 'Designer', 'Coder', 'Photographer'];
const ALLOWED_VIDEO_TYPE = 'video/mp4';
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

const emptySlot = () => ({
  file: null,
  previewUrl: null,
  title: '',
  category: '',
  description: '',
  visibility: StringValue.TYPE_VIDEO_PUBLIC,
  isUploading: false,
  isDone: false,
  error: null,
});

export default function UploadVideoModal({ isOpen, onClose, onUploadSuccess }) {
  const [slot, setSlot] = useState(emptySlot());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  if (!isOpen) return null;

  const updateSlot = (patch) => {
    setSlot((prev) => ({ ...prev, ...patch }));
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== ALLOWED_VIDEO_TYPE) {
      toast.error('Only MP4 video format is allowed.');
      return;
    }

    if (selectedFile.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error(`File is too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB). Maximum file size is 50MB.`);
      return;
    }
    if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
    updateSlot({
      file: selectedFile,
      previewUrl: URL.createObjectURL(selectedFile),
      uploadProgress: null,
    });
  };

  const removeFile = () => {
    if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
    updateSlot({ file: null, previewUrl: null, uploadProgress: null });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handlePublish = () => {
    if (!slot.file) return;
    submitVideo(slot);
  };

  const submitVideo = async (currentSlot) => {
    updateSlot({ isUploading: true, error: null });
    try {
      const fd = new FormData();
      fd.append('File', currentSlot.file);
      fd.append('Title', currentSlot.title);
      fd.append('Category', currentSlot.category);
      fd.append('Description', currentSlot.description);
      fd.append('Visibility', currentSlot.visibility);
      console.log("check file: ", currentSlot.file)
      const res = await axiosClient.post(API.AXIOS_VIDEO_UPLOAD, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.isSuccess) {
        toast.success('Upload video success');
        onUploadSuccess?.(res.data);
        resetAndClose();
      }else {
        toast.error(res.data.message || 'Upload failed');
        updateSlot({ isUploading: false });
      }
    } catch (err) {
       toast.error(err.response?.data?.message || 'Upload failed');
      updateSlot({ isUploading: false, error: err.message });
    }
  };

  const resetAndClose = () => {
    if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
    setSlot(emptySlot());
    onClose();
  };

  const canPublish = !!slot.file && !!slot.title && !!slot.category;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden">
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

        <div className="p-6 pt-4 space-y-5 border-t border-gray-100 flex-1 overflow-y-auto">

          {!slot.file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-6 h-44 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
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
                or <span className="text-blue-600 font-medium">browse</span> from your device · MP4, up to 50MB
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
            <div className="relative rounded-xl overflow-hidden bg-gray-900 h-66">
              <video src={slot.previewUrl} className="w-full h-full object-contain" controls />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {slot.file && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="truncate">{slot.file.name}</span>
              <span className="text-gray-300">·</span>
              <span>{(slot.file.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          )}
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slot.title}
                onChange={(e) => updateSlot({ title: e.target.value })}
                placeholder="Give your video a title"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="input-group flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Visibility</label>
              <select
                name='skillLevel'
                value={slot.visibility}
                onChange={(e) => updateSlot({ visibility: e.target.value })}
                className="inp-skill-level w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <option key={StringValue.TYPE_VIDEO_PUBLIC} value={StringValue.TYPE_VIDEO_PUBLIC}>{StringValue.TYPE_VIDEO_PUBLIC}</option>
                <option key={StringValue.TYPE_VIDEO_PRIVATE} value={StringValue.TYPE_VIDEO_PRIVATE}>{StringValue.TYPE_VIDEO_PRIVATE}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateSlot({ category: cat })}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                    slot.category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={slot.description}
              onChange={(e) => updateSlot({ description: e.target.value })}
              rows={3}
              placeholder="Tell viewers about your performance..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={resetAndClose}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!canPublish || slot.isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {slot.isUploading ? 'Uploading...' : 'Publish'}
          </button>
        </div>

      </div>
    </div>
  );
}