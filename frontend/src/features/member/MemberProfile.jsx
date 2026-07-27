import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getMyLoans, getAllLoans, returnBook } from '../../util/circulationApi';
import { useSelector } from 'react-redux';
import { getBook } from '../../util/catalogApi';

const MemberProfile = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState('');
  const [returnError, setReturnError] = useState('');
  const { user } = useSelector(state => state.avatar);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = user?.role === 'admin' ? await getAllLoans() : await getMyLoans();
      const loansWithBooks = await Promise.all(
        res.data.map(async (loan) => {
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
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8">{user?.role === 'admin' ? 'System Loans' : 'My Loans'}</h1>
        {error && <p className="text-sm text-primary mb-6">{error}</p>}
        {returnError && <p className="text-sm text-primary mb-6">{returnError}</p>}

        {loans.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
            <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
            No loans yet.
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const overdue = isOverdue(loan);
              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-center"
                >
                  <div className="w-14 h-20 rounded-lg bg-foreground/5 overflow-hidden flex-shrink-0">
                    {loan.book?.coverUrl ? (
                      <img
                        src={loan.book.coverUrl}
                        className="w-full h-full object-cover"
                        alt={loan.book.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={20} className="text-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">
                      {loan.book?.title ?? 'Unknown book'}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-foreground/60 mt-1">
                      <Clock size={14} />
                      <span>Due {new Date(loan.dueAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {loan.returnedAt ? (
                      <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                        <CheckCircle2 size={12} /> Returned
                      </span>
                    ) : overdue ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={12} /> Overdue
                      </span>
                    ) : null}
                  </div>

                  {!loan.returnedAt && (
                    <button
                      onClick={() => handleReturn(loan.id)}
                      disabled={returningId === loan.id}
                      className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      {returningId === loan.id ? 'Returning...' : 'Return'}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
