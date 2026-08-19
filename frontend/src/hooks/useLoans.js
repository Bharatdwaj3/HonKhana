import { useState, useEffect, useCallback } from 'react';
import { listMyLoans, listAllLoans, returnBook, renewBook } from '../util/circulationApi';

export function useLoans(isAdmin = false) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState(null);
  const [renewingId, setRenewingId] = useState(null);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await listAllLoans() : await listMyLoans();
      setLoans(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleReturn = async (id) => {
    setReturningId(id);
    try {
      await returnBook(id);
      await fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Return failed');
    } finally {
      setReturningId(null);
    }
  };

  const handleRenew = async (id) => {
    setRenewingId(id);
    try {
      await renewBook(id);
      await fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Renewal failed');
    } finally {
      setRenewingId(null);
    }
  };

  const isOverdue = (loan) => !loan.returnedAt && new Date(loan.dueAt) < new Date();

  return { 
    loans, 
    loading, 
    error, 
    returningId, 
    renewingId, 
    handleReturn, 
    handleRenew, 
    isOverdue, 
    refreshLoans: fetchLoans 
  };
}
