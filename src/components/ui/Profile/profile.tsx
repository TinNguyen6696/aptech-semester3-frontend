import { StringValue } from "@/lib/stringValue";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "@/lib/apiendpoint";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosClient from "@/services/axiosClient";
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';

export default function Profile(){
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [provinces, setProvinces] = useState([])
    const [options, setOptions] = useState([])
    const [userInfo, setUserInfo] = useState(() => {
        const savedUser = localStorage.getItem(StringValue.USER_INFO);
            try {
                return savedUser ? JSON.parse(savedUser) : null;
            } catch (error) {
                return null;
            }
    });    

    useEffect(() => {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(API.PROVINCE_GET_ALL)
          setProvinces(response.data.data)
        } catch (error) {
          console.error("Lỗi khi lấy danh sách tỉnh:", error)
        }
      }

      fetchProvinces()
    }, [])
    useEffect(() => {
        const fetchOptions = async () => {
            try {
            const response = await axios.get(API.OPTION_GET_ALL)
            setOptions(response.data.data)
            } catch (error) {
            console.error("Lỗi khi lấy danh sách options:", error)
            }
        }

        fetchOptions()
    }, []) 

    const [formData, setFormData] = useState({
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        username: userInfo?.username || "",
        bio: userInfo?.bio || "",
        major: userInfo?.major || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        website: userInfo?.website || "",
    });
    const validationSchema = Yup.object({
        firstName: Yup.string().required('Bắt buộc nhập'),
        lastName: Yup.string().required('Bắt buộc nhập'),
        userName: Yup.string().required('Bắt buộc nhập'),
        email: Yup.string().email('Email không hợp lệ').required('Bắt buộc nhập'),
    });
    const formik = useFormik({
        initialValues: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        province: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            
            
        },
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const onlyNumbers = value.replace(/[^0-9]/g, '');
            if (onlyNumbers.length <= 10) {
            setFormData(prev => ({ ...prev, [name]: onlyNumbers }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = { ...userInfo, ...formData };
        localStorage.setItem(StringValue.USER_INFO, JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: userInfo?.firstName || "",
            lastName: userInfo?.lastName || "",
            username: userInfo?.username || "",
            bio: userInfo?.bio || "",
            major: userInfo?.major || "Singer",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
            website: userInfo?.website || "",
        });
        setIsEditing(false);
    };

    const getInitial = () => {
        const name = formData.firstName || formData.email || "";
        return name.charAt(0).toUpperCase();
    };
    const onTriggerUpload = ()=>{
        fileInputRef.current?.click();
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("File đã chọn:", file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }

        
    };
    return(
        <>
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">

                <div className="mb-4">
                    <h1 className="text-2xl font-extrabold text-gray-900">Your Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Update your information to make it easier for the community to find and recognize you.</p>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="mt-3 cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                            Edit profile
                        </button>
                    )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                        {previewUrl ? (
                            <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-20 h-20 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <span className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                            M
                            </span>
                        )}
                        <button type="button" onClick={onTriggerUpload} className="absolute -bottom-1 cursor-pointer -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                        </button>
                        </div>
                        <div>
                        <p className="text-sm font-semibold text-gray-900">Avatar</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG or JPG, Maximum 2MB</p>
                        <input 
                            hidden 
                            type="file"
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                            />
                    </div>
                </div>    
            {!isEditing ? (
                <div className="space-y-6 mt-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">About</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {formData.bio || <span className="text-gray-300">No bio yet.</span>}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Contact</h2>
                        <dl className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Email</dt>
                                <dd className="text-sm text-gray-800">{formData.email || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Phone</dt>
                                <dd className="text-sm text-gray-800">{formData.phone || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Website</dt>
                                <dd className="text-sm text-gray-800 truncate max-w-[220px]">{formData.website || "—"}</dd>
                            </div>
                        </dl>
                    </div>

                </div>
            ) : (
                /* ================= EDIT MODE ================= */            
                <form className="space-y-6 mt-5">                
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-5">Personal Infomation</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">First</label>
                            <input 
                                type="text" 
                                value={formData.firstName}
                                onChange={handleChange} 
                                name="firstName"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Last</label>
                            <input 
                                type="text" 
                                value={formData.lastName}
                                onChange={handleChange} 
                                name="lastName"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"/>
                        </div>
                        </div>

                        <div className="mt-5">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Display name</label>
                            <input 
                                type="text" 
                                value={formData.username}
                                onChange={handleChange} 
                                name="username"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                                />
                        </div>

                        <div className="mt-5">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort description</label>
                            <textarea 
                                rows={3} 
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                maxLength={300}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow resize-none" 
                                placeholder="Your sort description"></textarea>
                            <p className="text-xs text-gray-400 mt-1.5 text-right">{formData.bio.length}/300</p>
                        </div>

                        <div className="mt-5">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Major</label>                       
                        <select  
                            name='province'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.province}
                            className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow bg-white">
                            {options.talentCategories.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                        </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-5">Contact</h2>

                        <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={handleChange} 
                                name="email"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone</label>
                            <input 
                                type="tel" 
                                placeholder="+84 ..." 
                                value={formData.phone}
                                onChange={handleChange} 
                                name="phone"
                                maxLength={10}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                                />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Website / Social</label>
                            <input type="url" placeholder="https://" className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"/>
                        </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 pb-4">
                        <button type="button" onClick={handleCancel} className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5">Cancel</button>
                        <button type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                            Save Edit
                        </button>
                    </div>

                </form>
                )}
            </div>
        </>
    )
}