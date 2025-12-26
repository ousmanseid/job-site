import axios from './axiosInstance';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/employer/';

const getStats = () => {
    return axios.get(API_URL + 'stats');
};

const getRecentActivity = () => {
    return axios.get(API_URL + 'recent-activity');
};

const getJobs = () => {
    return axios.get(API_URL + 'jobs');
};

const deleteJob = (jobId) => {
    return axios.delete(API_URL + `jobs/${jobId}`);
};

const postJob = (jobData) => {
    return axios.post(API_URL + 'jobs', jobData);
};

const getProfile = () => {
    return axios.get(API_URL + 'profile');
};

const updateProfile = (profileData) => {
    return axios.put(API_URL + 'profile', profileData);
};

const updateJobStatus = (id, status) => {
    return axios.put(API_URL + `jobs/${id}/status?status=${status}`, {});
};

const getJobById = (id) => {
    return axios.get(API_URL + `jobs/${id}`);
};

const updateJob = (id, jobData) => {
    return axios.put(API_URL + `jobs/${id}`, jobData);
};

const uploadLogo = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(API_URL + 'profile/logo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const EmployerService = {
    getStats,
    getRecentActivity,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    postJob,
    updateJobStatus,
    getProfile,
    updateProfile,
    uploadLogo
};

export default EmployerService;
