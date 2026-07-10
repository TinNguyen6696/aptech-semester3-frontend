import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';
import { StringValue } from '@/lib/stringValue';

export default function LoginForm(){
    const navigate = useNavigate();

    const validationSchema = Yup.object({
            email: Yup.string().email('Invalid email').required('This field is required'),
            password: Yup.string().required('This field is required'),
    });

    const formik = useFormik({
        initialValues: {
        email: '',
        password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const req = {
                Email:values.email,
                Password:values.password
            }
            try {
                const res = await axiosClient.post(API.AXIOS_LOGIN, req);
                
                if(res.data.isSuccess){
                    const token = res.data.data.accessToken;
                    localStorage.setItem(StringValue.ACCESS_TOKEN, token);
                    localStorage.setItem(StringValue.USER_INFO, JSON.stringify(res.data.data.user));
                    navigate({ to: '/' });
                }              
                resetForm();
            
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    const statusCode = error.response?.status;
                    if(statusCode == 403){
                        navigate({ 
                            to: '/resend-verification',
                            search: { email: values.email } 
                        });
                    }else{
                        const message = error.response?.data?.message || 'Something went wrong, please try again.';
                        toast.error(message);
                    }
                } else {
                    console.log("Error with no response:", error);
                }                       
            } finally {
                setSubmitting(false);
            }
        },
    });

    const onSendMailForgotPw = async () => {
        navigate({ to: '/forgot-password' });
    }


    return(
        <>
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-1 text-start text-gray-800">Welcome back</h2>
                <span className="text-xs">Sign in to your Spotlight account</span>
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            name='email'
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            type="email" 
                            placeholder="email@example.com"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs">{formik.errors.email}</p>
                            )}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            type="password" 
                            placeholder="********"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs">{formik.errors.password}</p>
                            )}
                    </div>
                    <div className='text-end mb-2'>
                        <a className='cursor-pointer text-xs text-blue-600 hover:text-blue-700 hover:underline' onClick={onSendMailForgotPw}>
                            Forgot password?
                        </a>
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