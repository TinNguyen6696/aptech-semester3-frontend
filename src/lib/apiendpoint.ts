const URL = `http://localhost:5208`;
const URL_API = `${URL}/api`;
const URL_API_AUTH = `${URL_API}/auth`;

export const API = {
    URL:URL,
    URL_API: URL_API,
    PROVINCE_GET_ALL :`${URL_API}/provinces`,
    OPTION_GET_ALL:`${URL_API}/options`,
    REGISTER: `${URL_API_AUTH}/register`,
    VIDEOS_GET_ALL_PUBLIC:`${URL_API}/videos`,
    VIDEO_GET_BY_ID:`${URL_API}/videos/{id}`,

    /* axios client */
    AXIOS_REGISTER:`auth/register`,
    AXIOS_LOGIN:`auth/login`,
    AXIOS_REFRESH_TOKEN:`/auth/refresh`,
    
    AXIOS_UPDATE_PROFILE:`/users/me`,
    AXIOS_UPLOAD_IMAGE:`uploads/image`,
    AXIOS_UPLOAD_PROFILE_AVATAR:`/users/me/avatar`,

    AXIOS_SEND_FORGOT_PW :`auth/forgot-password`,
    AXIOS_RESET_PW:`auth/reset-password`,

    AXIOS_CHANGE_PW:'auth/change-password',

    AXIOS_VERIFY_EMAIL:`auth/verify-email`,
    AXIOS_RESEND_VERIFY_EMAIL:`auth/resend-verification`,

    AXIOS_ACHIEVEMENT_INSERT:`/users/me/achievements`,
    AXIOS_ACHIEVEMENT_GET_ALL:`/users/me/achievements`,
    AXIOS_ACHIEVEMENT_DELETE:`/users/me/achievements/{id}`,
    AXIOS_ACHIEVEMENT_UPDATE:`/users/me/achievements/{id}`,

    AXIOS_VIDEO_UPLOAD:`/users/me/videos`,
    AXIOS_VIDEO_GET_ALL:`/users/me/videos`,
    AXIOS_VIDEO_DELETE:`/users/me/videos/{id}`,
    AXIOS_VIDEO_UPDATE:`/users/me/videos/{id}`
}