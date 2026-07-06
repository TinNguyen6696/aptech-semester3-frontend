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
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(StringValue.ACCESS_TOKEN);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;