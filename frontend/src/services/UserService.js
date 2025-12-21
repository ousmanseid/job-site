import axios from './axiosInstance';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/users';

const getMyProfile = () => {
    return axios.get(`${API_URL}/me`);
};

const updateProfile = (id, userData) => {
    return axios.put(`${API_URL}/${id}`, userData);
};

const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/profile-picture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const UserService = {
    getMyProfile,
    updateProfile,
    uploadProfilePicture
};

export default UserService;
