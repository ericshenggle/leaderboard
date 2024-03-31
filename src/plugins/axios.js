// src/plugins/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // baseURL
    timeout: 5000, // request timeout
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

export default axiosInstance;
