import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosClient from "@/services/axiosClient";
import { toast } from "react-toastify";
import { API } from "@/lib/apiendpoint";

export default function ChangePassword(){

    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required('This field is required'),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('This field is required'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
            .required('This field is required'),
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const req = {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmNewPassword: values.confirmNewPassword,
                };
                const res = await axiosClient.post(API.AXIOS_CHANGE_PW, req);
                if (res.data.isSuccess) {
                    toast.success('Password changed successfully!');
                    resetForm();
                    setIsChangingPassword(false);
                } else {
                    toast.error(res.data.message || 'Something went wrong');
                }
            } catch (error) {
                toast.error(error.response || 'Something went wrong');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancelPasswordChange = () => {
        passwordFormik.resetForm();
        setIsChangingPassword(false);
    };

    return(
        <>
            <div className="bg-white max-w-3xl mb-5 rounded-2xl mx-auto border border-gray-100 shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Password</h2>
                    {!isChangingPassword && (
                        <button
                            type="button"
                            onClick={() => setIsChangingPassword(true)}
                            className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Change password
                        </button>
                    )}
                </div>

                {!isChangingPassword ? (
                    <p className="text-sm text-gray-500">••••••••</p>
                ) : (
                    <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordFormik.values.currentPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                            {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                                <p className="text-red-500 text-xs">{passwordFormik.errors.currentPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">New password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordFormik.values.newPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                            {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                                <p className="text-red-500 text-xs">{passwordFormik.errors.newPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm new password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordFormik.values.confirmNewPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                            {passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword && (
                                <p className="text-red-500 text-xs">{passwordFormik.errors.confirmNewPassword}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancelPasswordChange}
                                className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={passwordFormik.isSubmitting}
                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                {passwordFormik.isSubmitting ? "Saving..." : "Save password"}
                </button>
            </div>
        </form>
    )}
</div>
        </>
    )
}