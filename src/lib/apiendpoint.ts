const URL = `http://localhost:5208`;
const URL_API = `${URL}/api`;
const URL_API_AUTH = `${URL_API}/auth`;

export const API = {
    URL:URL,
    URL_API: URL_API,
    PROVINCE_GET_ALL :`${URL_API}/provinces`,
    OPTION_GET_ALL:`${URL_API}/options`,
    REGISTER: `${URL_API_AUTH}/register`,
    
    /* axios client */
    AXIOS_REGISTER:`auth/register`,
    AXIOS_LOGIN:`auth/login`,
    AXIOS_UPDATE_PROFILE:`/users/me`,
    AXIOS_UPLOAD_IMAGE:`uploads/image`,
    AXIOS_UPLOAD_PROFILE_AVATAR:`/users/me/avatar`,

    AXIOS_ACHIEVEMENT_INSERT:`/users/me/achievements`,
    AXIOS_ACHIEVEMENT_GET_ALL:`/users/me/achievements`,
    AXIOS_ACHIEVEMENT_DELETE:`/users/me/achievements/{id}`,
    AXIOS_ACHIEVEMENT_UPDATE:`/users/me/achievements/{id}`,
}