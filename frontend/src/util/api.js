import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 8000,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Access token expired – trying to refresh login...');
        await api.post('/v1/auth/refresh');
        console.log('Refresh worked! Retrying original request...');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Could not refresh token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;