import axios from 'axios';
import AuthService from './AuthService';

// Create axios instance
const axiosInstance = axios.create();

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401/403 errors
let isRedirecting = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error(`Access denied (${error.response.status}). Token may be invalid or expired.`);

            // Only redirect once and not if already on login page
            if (!isRedirecting && window.location.pathname !== '/login') {
                isRedirecting = true;
                alert('Your session has expired. Please login again.');
                AuthService.logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
