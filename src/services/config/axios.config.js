import axios from 'axios';

const BASE_URL = 'https://care-pharmacy.vercel.app';

export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

privateAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.authorization = `pharma__${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

privateAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await publicAxios.post('/auth/refresh-token', { refreshToken });
                const { token } = response.data;
                localStorage.setItem('userToken', token);
                originalRequest.headers.Authorization = `pharma__${token}`;
                return privateAxios(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);