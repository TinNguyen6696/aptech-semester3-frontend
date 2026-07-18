import { X } from "lucide-react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";

export default function AddPostModal({ communityId, onClose, onCreated }) {
    const validationSchema = Yup.object({
        content: Yup.string().required("This field is required"),
    });

    const formik = useFormik({
        initialValues: {
            content: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setStatus(null);
            try {
                const req = {
                    Content: values.content.trim(),
                }
                const response = await axiosClient.post(API.AXIOS_COMMUNITY_POST_INSERT.replace("{id}", communityId), req);
                console.log("check res: ", response)
                onCreated(response.data.data);
            } catch (err) {
                console.error("Error creating post:", err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Add post</h2>
                    <button
                        aria-label="Close"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Share details, ask a question, or update the community"
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formik.touched.content && formik.errors.content && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
                        )}
                    </div>

                    {formik.status && <p className="text-sm text-rose-600">{formik.status}</p>}

                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? "Posting…" : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
