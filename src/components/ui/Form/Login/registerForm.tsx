import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';

export default function RegisterForm({provinces,options}){
    const categories = options?.talentCategories || [];
    const skillLevel = options?.skillLevels || [];
    const roles = options?.roles || [];
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Bắt buộc nhập'),
        lastName: Yup.string().required('Bắt buộc nhập'),
        userName: Yup.string().required('Bắt buộc nhập'),
        email: Yup.string().email('Email không hợp lệ').required('Bắt buộc nhập'),
        password: Yup.string().min(6, 'Mật khẩu phải từ 6 ký tự').required('Bắt buộc nhập'),
    });

    const formik = useFormik({
        initialValues: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        category: categories[0] || '',
        skillLevel: skillLevel[0] || '',
        province: '',
        role: roles[0] || '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            
            const req = {
                Username:values.userName,
                Email:values.email,
                FirstName:values.firstName,
                LastName:values.lastName,
                Role:values.role,
                Password:values.password,
                PrimaryCategory:values.category,
                SkillLevel:values.skillLevel,
                ProvinceId:values.province
            }
            console.log("check req: ", req)
            try {
                const res = await axiosClient.post(API.AXIOS_REGISTER, req);
                if(res.data.isSuccess){
                    const token = res.data.data.accessToken;
                    console.log("check token: ", res.data)
                    localStorage.setItem('accessToken', token);
                    navigate({ to: '/' });
                }else{
                    console.log("check lỗi: ", res.data.mesage);
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
                <h2 className="text-2xl font-bold mb-1 text-start text-gray-800">Create your account</h2>
                <span className="text-xs">Start showcasing your talent today. Free forever.</span>
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="flex gap-2">
                        <div className="input-group">
                            <label className="block text-gray-700 text-sm font-bold mb-2">First name</label>
                            <input  name='firstName' 
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                                    type="text" 
                                    placeholder="Your first name ..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstName}
                                    />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-xs">{formik.errors.firstName}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Last name</label>
                            <input  name='lastName' 
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                                    type="text" 
                                    placeholder="Your last name ..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                    />
                             {formik.touched.lastName && formik.errors.lastName && (
                                <p className="text-red-500 text-xs">{formik.errors.lastName}</p>
                            )}      
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">User name</label>
                        <input  name='userName' 
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                                type="text" 
                                placeholder="User name ..."
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.userName}
                                />
                          {formik.touched.userName && formik.errors.userName && (
                                <p className="text-red-500 text-xs">{formik.errors.userName}</p>
                            )}       
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email address</label>
                        <input  name='email' 
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
                        <input  name='password' 
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                                type="password" 
                                placeholder="Your password ..."
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs">{formik.errors.password}</p>
                            )}  
                    </div>
                    
                    <div className="flex gap-2 w-full">
                        <div className="input-group flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select 
                                name='category' 
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="inp-category w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                {categories.map((c, index) => (                                  
                                <option key={index} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Skill level</label>
                            <select 
                                value={formik.values.skillLevel}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name='skillLevel'
                                className="inp-skill-level w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                {skillLevel.map((sl, index) => (                                  
                                    <option key={index} value={sl}>{sl}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Provinces</label>
                        <select  
                            name='province'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.province}
                            className="inp-province w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            {provinces.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                        </select>    
                    </div> 

                    <div className="input-group">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select 
                            name='role'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.role}
                            className="inp-role w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              {roles.map((r, index) => (                                  
                                    <option key={index} value={r}>{r}</option>
                                ))}              
                        </select>    
                    </div>   

                    <button     
                        type='submit' 
                        disabled={formik.isSubmitting} 
                        className="cursor-pointer mt-3 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                        {formik.isSubmitting ? "Đang gửi..." : "Create account"}
                    </button>
                </form>
            </div>              
        </>
    )
}