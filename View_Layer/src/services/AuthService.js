import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/auth/';

const register = (firstName, lastName, email, password, role, companyName, companyDetails, phone, location) => {
    return axios.post(API_URL + 'register', {
        firstName,
        lastName,
        email,
        password,
        role: role.toUpperCase(),
        companyName,
        companyDetails,
        phone,
        location
    });
};

const login = (email, password) => {
    return axios
        .post(API_URL + 'login', {
            email,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
