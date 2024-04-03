// src/plugins/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // baseURL
    timeout: 10000, // request timeout
    withCredentials: true,
});

export default axiosInstance;
