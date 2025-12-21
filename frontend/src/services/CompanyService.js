import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = API_BASE_URL + '/companies';

const getAllCompanies = (page = 0, size = 10) => {
    return axios.get(`${API_URL}?page=${page}&size=${size}`);
};

const getCompanyById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const searchCompanies = (keyword, page = 0, size = 10) => {
    return axios.get(`${API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
};

const CompanyService = {
    getAllCompanies,
    getCompanyById,
    searchCompanies
};

export default CompanyService;
