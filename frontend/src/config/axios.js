import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add response interceptor for better error handling
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default instance; 