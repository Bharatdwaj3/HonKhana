import catalogApi from './catalogApi';

// Extend the existing working catalogApi instance
export const listMyLoans = () => catalogApi.get('/circulation/loan/mine');
export const listAllLoans = () => catalogApi.get('/circulation/loan/all');
export const returnBook = (id: number) => catalogApi.post(`/circulation/loan/${id}/return`);
export const renewBook = (id: number) => catalogApi.post(`/circulation/loan/${id}/renew`);
export const borrowBook = (data: { bookId: number }) => catalogApi.post('/circulation/loan/borrow', data);
export const getMyFines = () => catalogApi.get('/circulation/fine/mine');
export const createPayOrder = (fineId: number) => catalogApi.post(`/circulation/fine/${fineId}/pay`);
export const verifyPayment = (data: any) => catalogApi.post('/circulation/fine/verify', data);
