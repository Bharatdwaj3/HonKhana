import api from './api';

export const listMyLoans = () => api.get('/loan/mine');
export const listAllLoans = () => api.get('/loan/all');
export const returnBook = (id: number) => api.post(`/loan/${id}/return`);
export const renewBook = (id: number) => api.post(`/loan/${id}/renew`);
export const getMyFines = () => api.get('/fine/mine');
export const createPayOrder = (fineId: number) => api.post(`/fine/${fineId}/pay`);
export const verifyPayment = (data: any) => api.post('/fine/verify', data);
