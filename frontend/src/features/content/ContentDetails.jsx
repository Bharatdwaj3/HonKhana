import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Building2, Hash, Tag, Copy } from 'lucide-react';
import { getBook } from '../../util/catalogApi';
import { borrowBook as borrowBookRequest } from '../../util/circulationApi';

const ContentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowMessage, setBorrowMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBook(id);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/content", { replace: true });
        } else {
          setError(err.response ? "Something went wrong on our end." : "Cannot reach the server - check your network.");
          setLoading(false);
        }
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleBorrow = async () => {
    setBorrowing(true);
    setBorrowMessage('');
    try {
      await borrowBookRequest({ bookId: book.id });
      setBorrowMessage('Borrowed! Check My Loans to see it.');
      setBook({ ...book, availableCopies: book.availableCopies - 1 });
    } catch (err) {
      setBorrowMessage(err.response?.data?.message || 'Could not borrow this book.');
    } finally {
      setBorrowing(false);
    }
  };
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-primary mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-semibold text-foreground/70 hover:text-primary hover:border-primary transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }


  if (loading || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 mb-6 bg-card border border-border rounded-lg text-sm font-semibold text-foreground/70 hover:text-primary hover:border-primary transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12">
            <div className="w-40 h-56 rounded-xl bg-foreground/5 overflow-hidden flex-shrink-0 mx-auto md:mx-0">
              {book.coverUrl ? (
                <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                  <BookOpen size={40} className="text-foreground/20" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {book.genre?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genre.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
                    >
                      <Tag size={12} />
                      {g.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
                {book.title}
              </h1>
              <p className="text-lg text-foreground/60 mb-6">by {book.author}</p>

              <div className="space-y-3 text-sm text-foreground/70">
                <div className="flex items-center gap-2.5">
                  <Building2 size={16} className="text-foreground/40" />
                  <span>{book.publisher}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Hash size={16} className="text-foreground/40" />
                  <span>ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Copy size={16} className="text-foreground/40" />
                  <span>
                    {book.availableCopies} of {book.totalCopies} copies available
                  </span>
                </div>
              </div>

              {borrowMessage && (
                <p className="mt-4 text-sm font-semibold text-primary">{borrowMessage}</p>
              )}

              <button
                onClick={handleBorrow}
                disabled={book.availableCopies < 1 || borrowing}
                className="mt-8 px-6 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {borrowing
                  ? 'Borrowing...'
                  : book.availableCopies > 0
                  ? 'Borrow This Book'
                  : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ContentDetails;
