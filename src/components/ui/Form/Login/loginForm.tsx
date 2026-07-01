import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';


export default function LoginForm(){
    const navigate = useNavigate();

    const validationSchema = Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Bắt buộc nhập'),
            password: Yup.string().required('Bắt buộc nhập'),
    });

    const formik = useFormik({
        initialValues: {
        email: '',
        password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            const req = {
                Email:values.email,
                Password:values.password
            }
            try {
                const res = await axiosClient.post(API.AXIOS_LOGIN, req);
                if(res.data.isSuccess){
                    const token = res.data.data.accessToken;
                    console.log("check token: ", res.data)
                    localStorage.setItem('accessToken', token);
                    navigate({ to: '/' });
                }else{
                    console.log("check lỗi: ", res.data.message);
                }
                resetForm();
            
            } catch (error) {
                if (error.response) {
                    const serverData = error.response.data; 
                    toast.error(serverData.message || "Có lỗi xảy ra");
                } else {
                    console.log("Lỗi không có response:", error);
                }                       
            } finally {
                setSubmitting(false);
            }
        },
    });
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