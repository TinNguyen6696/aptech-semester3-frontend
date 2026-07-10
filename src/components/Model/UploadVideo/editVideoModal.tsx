// @/components/Model/UploadVideo/editVideoModal.jsx
import { API } from '@/lib/apiendpoint';
import { StringValue } from '@/lib/stringValue';
import axiosClient from '@/services/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CATEGORIES = ['Singer', 'Dancer', 'Artist', 'Designer', 'Coder', 'Photographer'];

export default function EditVideoModal({ isOpen, video, onClose, onUpdateSuccess }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    visibility: StringValue.TYPE_VIDEO_PUBLIC,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || '',
        category: video.category || '',
        description: video.description || '',
        visibility: video.visibility || StringValue.TYPE_VIDEO_PUBLIC,
      });
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const updateForm = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const videoSrc = `${API.URL}${video.videoUrl}`;

  const canSave = !!form.title && !!form.category;

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      const payload = {
        Title: form.title,
        Category: form.category,
        Description: form.description,
        Visibility: form.visibility,
      };
      const res = await axiosClient.put(
        API.AXIOS_VIDEO_UPDATE.replace("{id}", video.id),
        payload
      );
      if (res.data.isSuccess) {
        toast.success('Video updated successfully.');
        onUpdateSuccess?.(res.data);
        onClose();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit video details</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 pt-4 space-y-5 border-t border-gray-100 flex-1 overflow-y-auto">

          {/* Video preview - không có nút remove/replace */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 h-66">
            <video src={videoSrc} className="w-full h-full object-contain" controls />
          </div>

          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="Give your video a title"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="input-group flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Visibility</label>
              <select
                name='skillLevel'
                value={form.visibility}
                onChange={(e) => updateForm({ visibility: e.target.value })}
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
                  onClick={() => updateForm({ category: cat })}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                    form.category === cat
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
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
              placeholder="Tell viewers about your performance..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

      </div>
    </div>
  );
}