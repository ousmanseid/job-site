import axios from './axiosInstance';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/notifications/';

const getNotifications = (page = 0, size = 10) => {
    return axios.get(API_URL + `?page=${page}&size=${size}`);
};

const getUnreadCount = () => {
    return axios.get(API_URL + 'unread/count');
};

const markAsRead = (id) => {
    return axios.post(API_URL + `${id}/read`);
};

const markAllAsRead = () => {
    return axios.post(API_URL + 'read-all');
};

const NotificationService = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};

export default NotificationService;
