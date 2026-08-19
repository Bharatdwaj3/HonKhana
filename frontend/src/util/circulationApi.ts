import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/circulation`,
  withCredentials: true
});

export const borrowBook = (data: { bookId: number }) => api.post('/loan/borrow', data);
export const listMyLoans = () => api.get('/loan/mine');
export const listAllLoans = () => api.get('/loan/all');
export const returnBook = (id: number) => api.post(`/loan/${id}/return`);
export const renewBook = (id: number) => api.post(`/loan/${id}/renew`);
export const getMyFines = () => api.get('/fine/mine');
export const createPayOrder = (fineId: number) => api.post(`/fine/${fineId}/pay`);
export const verifyPayment = (data: any) => api.post('/fine/verify', data);
