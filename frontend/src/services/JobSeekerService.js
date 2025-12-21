import axios from './axiosInstance';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/jobseeker/';

const getStats = () => {
    return axios.get(API_URL + 'stats');
};

const getSavedJobs = () => {
    return axios.get(API_URL + 'saved-jobs');
};

const saveJob = (jobId) => {
    return axios.post(API_URL + `saved-jobs/${jobId}`, {});
};

const unsaveJob = (jobId) => {
    return axios.delete(API_URL + `saved-jobs/${jobId}`);
};

const getRecommendedJobs = () => {
    return axios.get(API_URL + 'recommended');
};

const getProfile = () => {
    return axios.get(API_URL + 'profile');
};

const updateProfile = (profileData) => {
    return axios.put(API_URL + 'profile', profileData);
};

const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(API_URL + 'profile/picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getJobAlerts = () => {
    return axios.get(API_URL + 'alerts');
};

const updateJobAlerts = (alertData) => {
    return axios.post(API_URL + 'alerts', alertData);
};

const getCVs = () => {
    return axios.get(API_BASE_URL + '/cv');
};

const getDefaultCV = () => {
    return axios.get(API_BASE_URL + '/cv/default');
};

const saveCV = (cvData) => {
    return axios.post(API_BASE_URL + '/cv', cvData);
};

const updateCV = (id, cvData) => {
    return axios.put(API_BASE_URL + `/cv/${id}`, cvData);
};

const deleteCV = (id) => {
    return axios.delete(API_BASE_URL + `/cv/${id}`);
};

const getCVTemplates = () => {
    return axios.get(API_BASE_URL + '/cv/templates');
};

const uploadCV = (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || 'Uploaded CV');
    return axios.post(API_BASE_URL + '/cv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

const setAsDefaultCV = (id) => {
    return axios.put(API_BASE_URL + `/cv/${id}`, { isDefault: true });
};

const JobSeekerService = {
    getStats,
    getSavedJobs,
    saveJob,
    unsaveJob,
    getRecommendedJobs,
    getProfile,
    updateProfile,
    uploadProfilePicture,
    getJobAlerts,
    updateJobAlerts,
    getCVs,
    getDefaultCV,
    saveCV,
    updateCV,
    deleteCV,
    getCVTemplates,
    uploadCV,
    setAsDefaultCV
};

export default JobSeekerService;
