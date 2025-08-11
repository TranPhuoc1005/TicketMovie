import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
});
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const accessToken = user ? user.accessToken : null;
    
    config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
        TokenCybersoft: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4',
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
    };
    return config;
});

export default api;



