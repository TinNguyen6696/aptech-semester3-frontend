// src/api/axiosClient.js
import axios from 'axios';
import {API} from '../lib/apiendpoint'
import { StringValue } from '@/lib/stringValue';

const axiosClient = axios.create({
  baseURL: API.URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(StringValue.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auth endpoints: a 401 here means bad credentials / invalid token, NOT an
    // expired session — let it reject so the caller can show the error, instead
    // of triggering a token refresh + redirect (which just reloads the page).
    const authPaths = ['auth/login', 'auth/register', 'auth/refresh', 'auth/forgot-password', 'auth/reset-password'];
    const isAuthRequest = authPaths.some((p) => originalRequest?.url?.includes(p));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(StringValue.REFRESH_TOKEN);
        const res = await axios.post(`${API.URL_API}${API.AXIOS_REFRESH_TOKEN}`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem(StringValue.ACCESS_TOKEN, accessToken);
        localStorage.setItem(StringValue.REFRESH_TOKEN, newRefreshToken);

        axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(StringValue.ACCESS_TOKEN);
        localStorage.removeItem(StringValue.REFRESH_TOKEN);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;