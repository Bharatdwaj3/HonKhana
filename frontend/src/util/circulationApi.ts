import axios from 'axios';
import membersApi from './membersApi';

const circulationApi = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 8000,
});

circulationApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await membersApi.post('/auth/refresh');
        return circulationApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default circulationApi;
// Loan routes
export const borrowBook = (data) => circulationApi.post('/loan', data);
export const returnBook = (id) => circulationApi.put(`/loan/${id}/return`);
export const getMyLoans = () => circulationApi.get('/loan/mine');
export const getAllLoans = () => circulationApi.get('/loan');
