import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps){

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or expired link');
            navigate({ to: '/login' });
        }
    }, [token, navigate]);

    const validationSchema = Yup.object({
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('This field is required'),
        confirmPassword:Yup.string().min(6, 'Password must be at least 6 characters').required('This field is required').oneOf([Yup.ref('password')], 'Passwords do not match')
    });

    const formik = useFormik({
        initialValues: {
        password: '',
        confirmPassword:''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const req = {
                    token: token,
                    newPassword: values.password,
                    confirmNewPassword: values.confirmPassword,
                };

                const res = await axiosClient.post(API.AXIOS_RESET_PW, req);

                if (res.data.isSuccess) {
                    toast.success('Password reset successful!');
                    resetForm();
                    navigate({ to: '/login' });
                } else {
                    toast.error(res.data.message || 'An error occurred');
                }
            } catch (error: any) {
                if (error.response) {
                    toast.error(error.response.data?.message || 'Invalid or expired token');
                } else {
                    toast.error('Unable to connect to the server');
                }
            } finally {
                setSubmitting(false);
            }        
        },
    });

    return(
        <>
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-1 text-start text-gray-800">Set your new Password</h2>
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            name='password'
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            type="password" 
                            placeholder="New password ..."
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs">{formik.errors.password}</p>
                            )}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input 
                            name="confirmPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            type="password" 
                            placeholder="********"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
                            )}
                    </div>
                    <button  
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        disabled={formik.isSubmitting}
                        >
                        {formik.isSubmitting ? "Loading..." : "Sign In"}
                    </button>
                </form>
            </div>              
        </>
    )
}