import axios from 'axios';
import AuthService from './AuthService';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/applications/';

const getAuthHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
};

const applyForJob = (jobId, coverLetter, cvId) => {
    return axios.post(API_URL + `apply/${jobId}`, { coverLetter, cvId }, { headers: getAuthHeader() });
};

const getMyApplications = () => {
    return axios.get(API_URL + 'my-applications', { headers: getAuthHeader() });
};

const getApplicationsByJob = (jobId) => {
    return axios.get(API_URL + `job/${jobId}`, { headers: getAuthHeader() });
};

const updateApplicationStatus = (applicationId, status, notes) => {
    let url = API_URL + `${applicationId}/status?status=${status}`;
    if (notes) {
        url += `&notes=${encodeURIComponent(notes)}`;
    }
    return axios.post(url, {}, { headers: getAuthHeader() });
};

const getCompanyApplications = () => {
    return axios.get(API_URL + 'company', { headers: getAuthHeader() });
};

const withdrawApplication = (id) => {
    return axios.delete(API_URL + id, { headers: getAuthHeader() });
};

const getApplicationCV = (applicationId) => {
    return axios.get(API_URL + `${applicationId}/cv`, { headers: getAuthHeader() });
};

const ApplicationService = {
    applyForJob,
    getMyApplications,
    getApplicationsByJob,
    getCompanyApplications,
    updateApplicationStatus,
    withdrawApplication,
    getApplicationCV
};

export default ApplicationService;
