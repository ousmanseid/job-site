import axios from 'axios';
import AuthService from './AuthService';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/admin';

const getAuthHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
};

const AdminService = {
    // Dashboard Statistics
    getStats: () => {
        return axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
    },

    getRecentApplications: () => {
        return axios.get(`${API_URL}/recent-applications`, { headers: getAuthHeader() });
    },

    // User Management
    getAllUsers: () => {
        return axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
    },

    getPendingEmployers: () => {
        return axios.get(`${API_URL}/employers/pending`, { headers: getAuthHeader() });
    },

    approveUser: (id) => {
        return axios.post(`${API_URL}/users/${id}/approve`, {}, { headers: getAuthHeader() });
    },

    deactivateUser: (id) => {
        return axios.post(`${API_URL}/users/${id}/deactivate`, {}, { headers: getAuthHeader() });
    },

    activateUser: (id) => {
        return axios.post(`${API_URL}/users/${id}/activate`, {}, { headers: getAuthHeader() });
    },

    deleteUser: (id) => {
        return axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
    },

    // Job Management
    getPendingJobs: () => {
        return axios.get(`${API_URL}/jobs/pending`, { headers: getAuthHeader() });
    },

    approveJob: (id) => {
        return axios.post(`${API_URL}/jobs/${id}/approve`, {}, { headers: getAuthHeader() });
    },

    rejectJob: (id) => {
        return axios.post(`${API_URL}/jobs/${id}/reject`, {}, { headers: getAuthHeader() });
    },

    // CV Templates Management
    getAllCVTemplates: () => {
        return axios.get(`${API_URL}/cv-templates`, { headers: getAuthHeader() });
    },

    createCVTemplate: (templateData) => {
        return axios.post(`${API_URL}/cv-templates`, templateData, { headers: getAuthHeader() });
    },

    updateCVTemplate: (id, templateData) => {
        return axios.put(`${API_URL}/cv-templates/${id}`, templateData, { headers: getAuthHeader() });
    },

    deleteCVTemplate: (id) => {
        return axios.delete(`${API_URL}/cv-templates/${id}`, { headers: getAuthHeader() });
    },

    // Settings Management
    getSettings: () => {
        return axios.get(`${API_URL}/settings`, { headers: getAuthHeader() });
    },

    updateSettings: (settings) => {
        return axios.post(`${API_URL}/settings`, settings, { headers: getAuthHeader() });
    },
};

export default AdminService;
