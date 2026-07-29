import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertTriangle, BookOpen } from 'lucide-react';
import { getMyLoans, returnBook, renewBook } from '../util/circulationApi';
import { getBook } from '../util/catalogApi';

export default function MyLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState(null);
  const [renewingId, setRenewingId] = useState(null);

  const loadLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getMyLoans();
      setLoans(data);

      // Fetch book details for each unique bookId referenced in the loans
      const uniqueBookIds = [...new Set(data.map((loan) => loan.bookId))];
      const bookEntries = await Promise.all(
        uniqueBookIds.map(async (id) => {
          try {
            const { data: book } = await getBook(id);
            return [id, book];
          } catch {
            return [id, null];
          }
        })
      );
      setBooks(Object.fromEntries(bookEntries));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleRenew = async (loanId) => {
    setRenewingId(loanId);
    try {
      await renewBook(loanId);
      await loadLoans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to renew book');
    } finally {
      setRenewingId(null);
    }
  };

  const handleReturn = async (loanId) => {
    setReturningId(loanId);
    try {
      await returnBook(loanId);
      await loadLoans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  const activeLoans = loans.filter((l) => !l.returnedAt);
  const returnedLoans = loans.filter((l) => l.returnedAt);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-foreground/5 rounded-lg transition-colors border border-border"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-black tracking-tight">My Loans</h1>
          </motion.div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-foreground/50">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading your loans...
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-16 text-foreground/50">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              You haven't borrowed any books yet.
            </div>
          ) : (
            <div className="space-y-6">
              {activeLoans.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground/60 mb-3 uppercase tracking-wide">
                    Current Loans
                  </h2>
                  <div className="space-y-3">
                    {activeLoans.map((loan) => {
                      const book = books[loan.bookId];
                      return (
                        <div
                          key={loan.id}
                          className={`p-4 rounded-xl border flex items-center gap-4 ${
                            loan.isOverdue
                              ? 'border-red-500/40 bg-red-500/5'
                              : 'border-border bg-card'
                          }`}
                        >
                          {book?.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="h-16 w-11 object-cover rounded-md flex-shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-11 bg-foreground/10 rounded-md flex-shrink-0 flex items-center justify-center">
                              <BookOpen size={16} className="text-foreground/30" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {book?.title || `Book #${loan.bookId}`}
                            </p>
                            <p className="text-sm text-foreground/50 truncate">
                              {book?.author}
                            </p>
                            <p
                              className={`text-xs mt-1 flex items-center gap-1 ${
                                loan.isOverdue ? 'text-red-500 font-medium' : 'text-foreground/50'
                              }`}
                            >
                              {loan.isOverdue && <AlertTriangle size={12} />}
                              {loan.isOverdue
                                ? `Overdue by ${loan.daysOverdue} day${loan.daysOverdue === 1 ? '' : 's'}`
                                : `Due ${new Date(loan.dueAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRenew(loan.id)}
                            disabled={renewingId === loan.id}
                            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-semibold hover:bg-foreground/5 transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {renewingId === loan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Renew'
                            )}
                          </button>

                          <button
                            onClick={() => handleReturn(loan.id)}
                            disabled={returningId === loan.id}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {returningId === loan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Return'
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {returnedLoans.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground/60 mb-3 uppercase tracking-wide">
                    Past Loans
                  </h2>
                  <div className="space-y-3">
                    {returnedLoans.map((loan) => {
                      const book = books[loan.bookId];
                      return (
                        <div
                          key={loan.id}
                          className="p-4 rounded-xl border border-border bg-card flex items-center gap-4 opacity-60"
                        >
                          {book?.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="h-16 w-11 object-cover rounded-md flex-shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-11 bg-foreground/10 rounded-md flex-shrink-0 flex items-center justify-center">
                              <BookOpen size={16} className="text-foreground/30" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {book?.title || `Book #${loan.bookId}`}
                            </p>
                            <p className="text-xs text-foreground/50 mt-1">
                              Returned {new Date(loan.returnedAt).toLocaleDateString()}
                              {loan.fineAmount > 0 && ` — Fine: ₹${loan.fineAmount}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
