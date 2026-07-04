import { StringValue } from "@/lib/stringValue";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "@/lib/apiendpoint";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosClient from "@/services/axiosClient";
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';
import { useUserStore } from "@/Store/userStore";

export default function Profile(){
    const navigate = useNavigate();
    const { userInfo, updateUserInfo } = useUserStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [provinces, setProvinces] = useState([])
    const [options, setOptions] = useState([])
    const previewUrl = userInfo?.profileImageUrl 
        ? `${API.URL}/${userInfo.profileImageUrl}` 
        : null; 
    useEffect(() => {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(API.PROVINCE_GET_ALL)
          setProvinces(response.data.data)
        } catch (error) {
          console.error("Failed to fetch provinces:", error)
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
            console.error("Failed to fetch options:", error)
            }
        }

        fetchOptions()
    }, []) 
    interface ProfileFormValues {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        phoneNumber: string;
        bio: string;
        provinceName: string;
        provinceId:number;
        category:string;
        skillLevel:string;
        role:string;
    }
    const validationSchema = Yup.object({
        firstName: Yup.string().required('This field is required'),
        lastName: Yup.string().required('This field is required'),
        username: Yup.string().required('This field is required'),
        email: Yup.string().email('Invalid email address').required('This field is required'),
        bio: Yup.string().max(300, 'Maximum 300 characters'),
        phoneNumber: Yup.string()
                .matches(/^[0-9]*$/, 'Phone number must contain digits only')
                .nullable()
                .notRequired()
    });
    const formik = useFormik<ProfileFormValues>({
        initialValues: {
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        username: userInfo?.username || "",
        email: userInfo?.email || "",
        phoneNumber: userInfo?.phoneNumber || "",
        bio: userInfo?.bio || "",
        provinceId: userInfo?.provinceId || 0,
        provinceName: userInfo?.provinceName || "",
        category:userInfo?.primaryCategory || "",
        skillLevel:userInfo?.skillLevel || "",
        role:userInfo?.role || ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            const req = {
                Username:values.username,
                FirstName:values.firstName,
                Bio:values.bio,
                Email:values.email,
                LastName:values.lastName,
                Role:values.role,
                PrimaryCategory:values.category,
                SkillLevel:values.skillLevel,
                ProvinceId:values.provinceId,
                PhoneNumber:values.phoneNumber
            }
            console.log("check email: ", req)
            try {
                const res = await axiosClient.put(API.AXIOS_UPDATE_PROFILE, req);
                if(res.data.isSuccess){
                    toast.success(res.data.message);
                    const updatedUser = res.data.data;
                    updateUserInfo(updatedUser); 
                    setIsEditing(false);
                }else{
                    toast.error(res.data.message);
                }                          
            } catch (error) {
                if (error.response) {
                    const serverData = error.response.data; 
                    toast.error(serverData.message || "Something went wrong");
                } else {
                    console.log("No response received:", error);
                }                       
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        formik.resetForm();
        setIsEditing(false);
    };

    const onTriggerUpload = ()=>{
        fileInputRef.current?.click();
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];
        const MAX_SIZE_MB = 2;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            toast.error(`Image is too large! Please choose a file smaller than ${MAX_SIZE_MB}MB.`);
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Unsupported format. Please choose JPG, PNG, or WEBP.');
            return;
        }


        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            const formData = new FormData();

            formData.append("file", file);  
            try {
                const response = await axiosClient.put(API.AXIOS_UPLOAD_PROFILE_AVATAR, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if(response.data.isSuccess){
                    toast.success(response.data.message);
                    updateUserInfo({ profileImageUrl: response.data.data.profileImageUrl})
                }

            } catch (error) {
                console.error("Upload error:", error);
                toast.error('Failed to upload image!');
            }
            
        }

        
    };
    return(
        <>
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">

                <div className="mb-4">
                    <div className="flex gap-3">
                        <h1 className="text-2xl font-extrabold text-gray-900">{`${userInfo?.lastName} ${userInfo?.firstName}`}</h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {userInfo?.primaryCategory || 'Coder'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {userInfo?.skillLevel || 'Intermediate'}
                        </span>
                    </div>
                    
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
                            onError={(e) => {
                                e.currentTarget.src = StringValue.USER_AVATAR_DEFAULT;
                                e.currentTarget.onerror = null;
                            }}
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
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                            {userInfo?.bio || <span className="text-gray-300">No bio yet.</span>}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Contact</h2>
                        <dl className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Email</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.email || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Phone</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.phoneNumber || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Province</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.provinceName || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Skill Level</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.skillLevel || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Major</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.primaryCategory || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-semibold text-gray-400">Role</dt>
                                <dd className="text-sm text-gray-800">{userInfo?.role || "—"}</dd>
                            </div>
                        </dl>
                    </div>

                </div>
            ) : (
                /* ================= EDIT MODE ================= */            
                <form className="space-y-6 mt-5" onSubmit={formik.handleSubmit}>                
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-5">Personal Infomation</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">First</label>
                            <input 
                                type="text" 
                                value={formik.values.firstName}
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                name="firstName"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-xs">{formik.errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Last</label>
                            <input 
                                type="text" 
                                value={formik.values.lastName}
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                name="lastName"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-xs">{formik.errors.firstName}</p>
                            )}
                        </div>
                        </div>

                        <div className="mt-5">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Display name</label>
                            <input 
                                type="text" 
                                value={formik.values.username}
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                name="username"
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                                />
                            {formik.touched.username && formik.errors.username && (
                                <p className="text-red-500 text-xs">{formik.errors.username}</p>
                            )}
                        </div>

                        <div className="mt-5">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort description</label>
                            <textarea 
                                rows={3} 
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} 
                                maxLength={300}
                                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow resize-none" 
                                placeholder="Your sort description"></textarea>
                            <div>
                                {formik.touched.bio && formik.errors.bio && (
                                    <p className="text-red-500 text-xs">{formik.errors.bio}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1.5 text-right">{formik.values.bio.length}/300</p>
                            </div>    
                        </div>

                        <div className="mt-5 flex flex-row gap-4">
                            <div className="input-group w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Major</label>                       
                                <select  
                                    name='category'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.category}
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow bg-white">
                                    {(options?.talentCategories || []).map((p) => (
                                        <option value={p}>{p}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="input-group w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Skill level</label>                       
                                <select  
                                    name='skillLevel'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.skillLevel}
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow bg-white">
                                    {(options?.skillLevels || []).map((p) => (
                                        <option value={p}>{p}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-row gap-4">
                            <div className="input-group w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Province</label>                       
                                <select  
                                    name='provinceId'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.provinceId}
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow bg-white">
                                    {(provinces || []).map((p,index) => (
                                        <option key={index} value={p.id}>{p.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="input-group w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Roll</label>                       
                                <select  
                                    name='role'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.role}
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow bg-white">
                                    {(options?.roles || []).map((p, index) => (
                                        <option key={index} value={p}>{p}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-5">Contact</h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                                <input 
                                    type="email" 
                                    value={formik.values.email}
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                    name="email"
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                                />
                                {formik.touched.email && formik.errors.email && (
                                        <p className="text-red-500 text-xs">{formik.errors.email}</p>
                                    )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone</label>
                                <input 
                                    type="tel" 
                                    placeholder="+84 ..." 
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                    name="phoneNumber"
                                    maxLength={10}
                                    className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg transition-shadow"
                                    />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                        <p className="text-red-500 text-xs">{formik.errors.phoneNumber}</p>
                                    )}
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