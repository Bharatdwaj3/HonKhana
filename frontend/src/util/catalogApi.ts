import axios from 'axios';
import membersApi from './membersApi';

const catalogApi = axios.create({
  baseURL: '/api/v1',
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
// Book routes
export const getBooks = () => catalogApi.get('/book');
export const getBook = (id) => catalogApi.get(`/book/${id}`);
export const addBook = (data) => catalogApi.post('/book', data);
export const updateBook = (id, data) => catalogApi.put(`/book/${id}`, data);
export const deleteBook = (id) => catalogApi.delete(`/book/${id}`);
export const adjustBookCopies = (id, data) => catalogApi.patch(`/book/${id}/copies`, data);

// Storage routes
export const uploadFile = (formData) => catalogApi.post('/storage/upload', formData);
export const getFileUrl = (fileName) => catalogApi.get(`/storage/file/${fileName}`);
export const listFiles = () => catalogApi.get('/storage/files');
export const deleteFile = (fileName) => catalogApi.delete(`/storage/file/${fileName}`);
