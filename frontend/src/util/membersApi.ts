import axios from 'axios';

const membersApi = axios.create({
  baseURL: 'http://localhost:4003/api/v1',
  withCredentials: true,
  timeout: 8000,
});

membersApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await membersApi.post('/auth/refresh');
        return membersApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default membersApi;