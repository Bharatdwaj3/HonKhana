import axios from 'axios';
import membersApi from './membersApi';

const catalogApi = axios.create({
  baseURL: 'http://localhost:4001/api/v1',
  withCredentials: true,
  timeout: 8000,
});

catalogApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Catalog can't refresh its own tokens — only Members can.
        await membersApi.post('/auth/refresh');
        return catalogApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default catalogApi;