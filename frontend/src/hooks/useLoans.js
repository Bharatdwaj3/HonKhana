import { useEffect, useState } from 'react';
import { getMyLoans, getAllLoans, returnBook } from '../util/circulationApi';
import { getBook } from '../util/catalogApi';

export function useLoans(isAdmin) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState('');
  const [returnError, setReturnError] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await getAllLoans() : await getMyLoans();
      const loansWithBooks = await Promise.all(
           (Array.isArray(res.data) ? res.data : []).map(async (loan) => {
          try {
            const bookRes = await getBook(loan.bookId);
            return { ...loan, book: bookRes.data };
          } catch {
            return { ...loan, book: null };
          }
        })
      );
      setLoans(loansWithBooks);
      setError('');
    } catch (err) {
      setError(err.response ? 'Something went wrong on our end.' : 'Cannot reach the server - check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [isAdmin]);

  const handleReturn = async (loanId) => {
    setReturningId(loanId);
    setReturnError('');
    try {
      await returnBook(loanId);
      await fetchLoans();
    } catch (err) {
      setReturnError(err.response?.data?.message || (err.response ? 'Something went wrong on our end.' : 'Cannot reach the server - check your network.'));
    } finally {
      setReturningId(null);
    }
  };

  const isOverdue = (loan) => !loan.returnedAt && new Date(loan.dueAt) < new Date();
  const totalFinesOwed = loans.reduce((sum, loan) => sum + (loan.fineAmount || 0), 0);

  return {
    loans,
    loading,
    error,
    returnError,
    returningId,
    handleReturn,
    isOverdue,
    totalFinesOwed,
  };
}
