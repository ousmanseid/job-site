import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/jobs';

const getAllJobs = (page = 0, size = 10) => {
    return axios.get(`${API_URL}?page=${page}&size=${size}`);
};

const getJobById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const searchJobs = (keyword, page = 0, size = 10) => {
    return axios.get(`${API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
};

const advancedSearch = (params, page = 0, size = 10) => {
    let query = `?page=${page}&size=${size}`;
    if (params.keyword) query += `&keyword=${encodeURIComponent(params.keyword)}`;
    if (params.location) query += `&location=${encodeURIComponent(params.location)}`;
    if (params.category && params.category !== 'All') query += `&category=${encodeURIComponent(params.category)}`;
    if (params.jobType) query += `&jobType=${params.jobType}`;
    return axios.get(`${API_URL}/search/advanced${query}`);
};

const getJobsByCompany = (companyId, page = 0, size = 10) => {
    return axios.get(`${API_URL}/company/${companyId}?page=${page}&size=${size}`);
};

const JobService = {
    getAllJobs,
    getJobById,
    searchJobs,
    advancedSearch,
    getJobsByCompany
};

export default JobService;
